/** Public privacy boundary. Imported values never become output strings. */
const catalog = [
  { topic: 'Programming', words: ['code','python','javascript','function','bug','debug','test','typescript'], task: 'Debug code', verbs: ['debug','fix','repair'], prompt: 'Find a minimal reproduction, explain the cause, and propose a verified correction.', checklist: ['Reproduce the issue','Isolate the cause','Verify the correction'] },
  { topic: 'Writing', words: ['writing','draft','essay','paragraph','prose','edit','rewrite','article'], task: 'Revise writing', verbs: ['revise','edit','rewrite'], prompt: 'Revise a draft for clarity, structure, and audience.', checklist: ['Identify the audience','Clarify the structure','Check the revision'] },
  { topic: 'Learning', words: ['lesson','teach','learning','student','quiz','curriculum','course','exercise'], task: 'Design lesson', verbs: ['design','create','prepare'], prompt: 'Design a lesson with an objective, practice, and a learning check.', checklist: ['State the objective','Add guided practice','Check understanding'] },
  { topic: 'Planning', words: ['project','plan','milestone','schedule','deadline','roadmap','tasks','scope'], task: 'Plan project', verbs: ['plan','organize','schedule'], prompt: 'Plan a project with scope, milestones, and verification steps.', checklist: ['Define scope','Sequence milestones','Verify outcomes'] }
] as const;
export type Topic = typeof catalog[number]['topic'];
export type Task = typeof catalog[number]['task'];
export interface SafeBook { readonly topic: Topic; readonly conversations: number; readonly recurring: readonly { readonly task: Task; readonly conversations: number; readonly prompt: typeof catalog[number]['prompt']; readonly checklist: readonly typeof catalog[number]['checklist'][number][] }[] }
export interface SafeLibrary { readonly books: readonly SafeBook[]; readonly status: 'READY' | 'REJECTED_INPUT' }
const rejected = (): SafeLibrary => ({books: [], status: 'REJECTED_INPUT'});
const obj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const own = (v: Record<string, unknown>, k: string): unknown => Object.hasOwn(v,k) ? v[k] : undefined;
// Conservative heuristic only. Closed DTO is the stronger, structural privacy guarantee.
const sensitive = /@|https?:|\b\d{3}[- .]?\d{2}[- .]?\d{4}\b|\b(?:password|secret|token|api.key|address|phone|salary|diagnosis|medical|patient|therapy|chemotherapy|cancer|bank|credit|passport|ssn|suicide|religion|political|confidential|private)\b|sk-[a-z0-9]+/i;
function active(c: Record<string, unknown>): string[] | null {
  const mapping = c.mapping;
  if (!obj(mapping) || typeof c.current_node !== 'string') return null;
  let cursor: unknown = c.current_node;
  const visited = new Set<string>(); const texts: string[] = []; let size = 0;
  while (cursor !== null) {
    if (typeof cursor !== 'string' || visited.has(cursor) || visited.size >= 2000) return null;
    visited.add(cursor);
    const node = own(mapping,cursor);
    if (!obj(node) || (node.id !== undefined && node.id !== cursor)) return null;
    const m = node.message;
    if (m !== null && m !== undefined) {
      if (!obj(m) || !obj(m.author) || typeof m.author.role !== 'string' || !['user','assistant','system','tool','developer'].includes(m.author.role)) return null;
      if (obj(m.author) && m.author.role === 'user') {
        if (!obj(m.content) || m.content.content_type !== 'text' || !Array.isArray(m.content.parts) || !m.content.parts.every(p=>typeof p === 'string')) return null;
        const text = m.content.parts.join(' '); size += text.length;
        if (size > 100000) return null;
        texts.push(text);
      }
    }
    cursor = node.parent;
  }
  return texts.reverse();
}
function classify(messages: readonly string[], threshold: number) {
  const text = messages.join('\n');
  if (sensitive.test(text)) return [];
  const tokens = new Set(text.toLowerCase().match(/[a-z]+/g) ?? []);
  return catalog.flatMap(c => {
    const hits = c.words.filter(w=>tokens.has(w)).length;
    // Per-topic binary cosine: other topics must not dilute independent evidence.
    const score = hits / Math.sqrt(c.words.length * Math.max(1, hits));
    // A task needs affirmative evidence in the same clause as its topic.
    // Ambiguous/negated clauses abstain rather than borrowing another task's verb.
    const task = messages.flatMap(message => message.toLowerCase().split(/[.!?;\n]+|\b(?:and|but)\b/)).some(clause => {
      const local = new Set(clause.match(/[a-z]+/g) ?? []);
      if (/[`"“”]/.test(clause) || /\b(?:not|never|without|avoid|dont|if|hypothetical|example|quote|quoted)\b|(?:don|can|won)['’]t/.test(clause)) return false;
      return c.words.filter(w => local.has(w)).length >= 2 && c.verbs.some(v => local.has(v));
    });
    return hits >= 2 && score >= threshold ? [{ c, task }] : [];
  });
}
/** Accept serialized JSON only; bounded parsing, no callbacks/getters from callers. */
export function analyze(files: readonly string[], threshold = 0.30): SafeLibrary {
  try {
    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1 || files.length > 20) return rejected();
    const records: Record<string,unknown>[] = [];
    for (const file of files) {
      if (typeof file !== 'string' || new TextEncoder().encode(file).length > 10000000) return rejected();
      const root: unknown = JSON.parse(file);
      const rows: unknown[] = Array.isArray(root) ? root : obj(root) && Array.isArray(root.conversations) ? root.conversations : [root];
      if (records.length + rows.length > 10000 || !rows.every(obj)) return rejected();
      records.push(...rows as Record<string,unknown>[]);
    }
    const unique = new Map<string,{ text: string[] | null; conflict: boolean }>();
    for (const record of records) {
      const id = record.id ?? record.conversation_id;
      if (typeof id !== 'string' || !id || (record.id !== undefined && record.conversation_id !== undefined && record.id !== record.conversation_id)) continue;
      const text = active(record); const prior = unique.get(id);
      if (prior) { if (JSON.stringify(prior.text) !== JSON.stringify(text)) prior.conflict = true; }
      else unique.set(id,{text,conflict:false});
    }
    const counts = new Map<Topic,{count:number; tasks:number}>();
    for (const {text,conflict} of unique.values()) {
      if (text === null || conflict) continue;
      for (const {c,task} of classify(text,threshold)) {
        const count = counts.get(c.topic) ?? {count:0,tasks:0}; count.count++; if(task) count.tasks++; counts.set(c.topic,count);
      }
    }
    return { status:'READY', books: catalog.flatMap(c=>{
      const count = counts.get(c.topic); if(!count) return [];
      return [{topic:c.topic,conversations:count.count,recurring:count.tasks >= 2 ? [{task:c.task,conversations:count.tasks,prompt:c.prompt,checklist:[...c.checklist]}] : []}];
    }) };
  } catch { return rejected(); }
}
export const syntheticMockLibrary: SafeLibrary = analyze([JSON.stringify([0,1].map(i=>({id:`synthetic-${i}`,current_node:'u',mapping:{u:{parent:null,message:{author:{role:'user'},content:{content_type:'text',parts:['Debug python code and fix the function bug.']}}}}})))]);
