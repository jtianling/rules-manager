# rulesmgr

Unified rules manager for AI coding tools. Maintain one set of rules, deploy to Claude Code, Cursor, Cline, and more.

## Installation

```bash
npx rulesmgr setup
```

## Usage

### Setup global rules

```bash
npx rulesmgr setup
```

Creates `~/.rules-manager/` with example rule templates.

### Deploy rules to a project

```bash
# Interactive mode
npx rulesmgr init

# With arguments
npx rulesmgr init --tools=claude-code,cursor --lang=typescript

# Use copy instead of symlink
npx rulesmgr init --tools=claude-code --copy
```

### Sync copied rules

```bash
npx rulesmgr sync
```

Syncs rules that were deployed with `--copy` mode.

## Supported Tools

| Tool | Path | Link Support |
|------|------|--------------|
| Claude Code | `.claude/rules/` | ✓ |
| Cursor | `.cursor/rules/` | ✗ (requires .mdc) |
| Cline | `.clinerules/` | ✓ |
| Roo Code | `.roo/rules/` | ✓ |
| Kilo Code | `.kilocode/rules/` | ✓ |
| Windsurf | `.windsurf/rules/` | ✓ |
| OpenCode | `AGENTS.md` | ✗ (single file) |
| TRAE | `.trae/rules/` | ✓ |
| Goose | `goosehints` | ✗ (single file) |

## Directory Structure

```
~/.rules-manager/
├── 01-tech-stack.md
├── 02-coding-principles.md
├── 03-architecture.md
├── 04-testing.md
├── 05-git-commit.md
├── 06-code-review.md
└── languages/
    ├── typescript-coding-style.md
    ├── python-coding-style.md
    └── ...
```

## License

MIT
