# rulesmgr

[English](./README.md) | 中文

AI 编程工具的统一规则管理器。维护一份规则，部署到 Claude Code、Cursor、Cline 等多个工具。

## 安装

```bash
npx rulesmgr setup
```

## 使用方法

### 初始化全局规则

```bash
npx rulesmgr setup
```

在 `~/.rules-manager/` 创建示例规则模板。

### 部署规则到项目

```bash
# 交互模式
npx rulesmgr init

# 指定参数
npx rulesmgr init --tools=claude-code,cursor --lang=typescript

# 使用复制模式（而非符号链接）
npx rulesmgr init --tools=claude-code --copy

# 部署 .gitignore
npx rulesmgr init --gitignore

# 同时部署规则和 .gitignore
npx rulesmgr init --tools=claude-code --gitignore
```

### 同步已复制的规则

```bash
npx rulesmgr sync
```

同步使用 `--copy` 模式部署的规则。

## 支持的工具

| 工具 | 路径 | 支持链接 |
|------|------|----------|
| Claude Code | `.claude/rules/` | ✓ |
| Cursor | `.cursor/rules/` | ✗ (需要 .mdc 格式) |
| Cline | `.clinerules/` | ✓ |
| Roo Code | `.roo/rules/` | ✓ |
| Kilo Code | `.kilocode/rules/` | ✓ |
| Windsurf | `.windsurf/rules/` | ✓ |
| OpenCode | `AGENTS.md` | ✗ (单文件) |
| TRAE | `.trae/rules/` | ✓ |
| Goose | `goosehints` | ✗ (单文件) |
| Antigravity | `.agent/rules/` | ✓ |

## 目录结构

```
~/.rules-manager/
├── 01-tech-stack.md
├── 02-coding-principles.md
├── 03-architecture.md
├── 04-testing.md
├── 05-git-commit.md
├── 06-code-review.md
├── gitignore
└── languages/
    ├── typescript-coding-style.md
    ├── python-coding-style.md
    └── ...
```

## 许可证

MIT
