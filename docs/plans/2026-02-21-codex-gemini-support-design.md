# Add Codex CLI and Gemini CLI Support

## Summary

Add support for two new AI coding tools: OpenAI Codex CLI and Google Gemini CLI.

## Tool Specifications

### Codex CLI
- **Target path**: `AGENTS.md` (project root, shared with OpenCode)
- **Format**: Plain Markdown, merged single file
- **Symlink**: No (needs actual content)
- **Note**: Shares `AGENTS.md` with OpenCode — deploying either tool produces the same file

### Gemini CLI
- **Target path**: `GEMINI.md` (project root)
- **Format**: Plain Markdown, merged single file
- **Symlink**: No (needs actual content)

## Changes Required

1. `src/constants.ts` — Add `'codex'` and `'gemini-cli'` to `SUPPORTED_TOOLS` and `TOOL_DISPLAY_NAMES`
2. `src/tools/configs.ts` — Add two new `ToolConfig` entries

No changes needed to deployer, merge, or other services — existing `deploySingleFile` logic handles both tools.
