# Export compatibility research — 2026-11-26

OpenAI's current help article describes a ZIP with index.html viewer and JSON conversation data; older exports may have chat.html. It does not publish a guaranteed JSON schema:
https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data

Implementation-owner documentation describes mapping trees and current_node parent ancestry, but also flat messages from a private conversation API. Those API payloads must not be mistaken for a guaranteed account-export format:
https://github.com/ThierryAbalea/chatgpt-conversation-export/blob/main/docs/format.md

An export parser author's discussion provides historical mapping/current_node examples:
https://community.openai.com/t/decoding-exported-data-by-parsing-conversations-json-and-or-chat-html/403144

Supported adapters: array of mapping records, single mapping record, conversations array envelope. Envelope and split-file acceptance are defensive adapters, not claims of official schemas. id and conversation_id accepted. Flat messages, ZIP, HTML, attachments and missing/ambiguous branches deliberately unsupported. Branch validation fails closed per record. JSON syntax/size failures reject the import. No real export was downloaded or used.
