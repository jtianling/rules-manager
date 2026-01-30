# rulesmgr 设计文档

## 概述

`rulesmgr` 是一个 CLI 工具，用于统一管理各种 AI 编程工具（Claude Code、Cursor、Cline 等）的 rules 文件。用户在 `~/.rules-manager/` 维护一份 Markdown 格式的 rules，工具自动转换并部署到各项目目录。

## 核心特性

| 特性 | 说明 |
|------|------|
| 统一存储 | `~/.rules-manager/` 存储所有 Markdown 规则 |
| 多工具支持 | Claude Code、Cursor、Cline、Roo Code、Kilo Code、Windsurf、OpenCode、TRAE、Goose |
| 自动转换 | 根据目标工具生成对应格式（目录/单文件、.mdc 等） |
| Link/Copy | 默认 symlink，需要时可 copy |
| 优先级合并 | 按文件名前缀排序，重要内容在前 |

## 技术栈

- TypeScript + Node.js
- 依赖：commander（CLI 参数解析）、inquirer（交互式提问）
- 发布到 npm，支持 `npx rulesmgr` 直接运行
- 开源发布到 GitHub

## 命令设计

### `rulesmgr setup`

初始化全局 rules 仓库。

```bash
rulesmgr setup
```

- 创建 `~/.rules-manager/` 目录结构
- 生成示例 rules 文件（带优先级前缀）
- 创建 `languages/` 子目录和常见语言的 coding-style 模板

### `rulesmgr init`

在项目中部署 rules。

```bash
# 完整参数
rulesmgr init --tools=claude,cursor --lang=python,ts

# 部分参数，其余交互询问
rulesmgr init --tools=claude

# 纯交互模式
rulesmgr init

# 使用 copy 模式
rulesmgr init --tools=claude --copy
```

**参数行为：**

| 参数 | 未提供时行为 |
|------|-------------|
| `--tools` | 交互询问用户选择 |
| `--lang` | 交互询问用户选择 |
| `--rules` | 默认部署所有（languages/ 除外） |
| `--copy` | 默认使用 link 模式 |

### `rulesmgr sync`

同步 copy 模式的 rules。

```bash
rulesmgr sync
```

- 扫描项目中已有的 rules 文件（非 symlink）
- 对比 `~/.rules-manager/` 源文件
- 如果本地有修改，提示用户选择：覆盖 / 跳过 / 查看 diff

## 目录结构

### `~/.rules-manager/` 示例结构

```
~/.rules-manager/
├── 01-tech-stack.md           # 技术选型（框架、库、工具链）
├── 02-coding-principles.md    # 核心行为规则（搜索优先、复用优先、最小改动）
├── 03-architecture.md         # 架构规则（目录结构、模块划分）
├── 04-testing.md              # 测试规则
├── 05-git-commit.md           # Git 提交规范
├── 06-code-review.md          # 代码审查要点
└── languages/
    ├── python-coding-style.md
    ├── typescript-coding-style.md
    ├── go-coding-style.md
    └── rust-coding-style.md
```

### 项目结构

```
rulesmgr/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts              # CLI 入口
│   ├── commands/
│   │   ├── setup.ts          # setup 命令
│   │   ├── init.ts           # init 命令
│   │   └── sync.ts           # sync 命令
│   ├── tools/                # 各工具的适配器
│   │   ├── base.ts           # 抽象基类
│   │   ├── claude-code.ts
│   │   ├── cursor.ts
│   │   ├── cline.ts
│   │   ├── roo-code.ts
│   │   ├── kilo-code.ts
│   │   ├── windsurf.ts
│   │   ├── opencode.ts
│   │   ├── trae.ts
│   │   └── goose.ts
│   ├── utils/
│   │   ├── fs.ts             # 文件操作（link/copy）
│   │   ├── merge.ts          # 规则合并逻辑
│   │   └── diff.ts           # 文件对比
│   └── templates/            # setup 生成的示例模板
│       ├── 01-tech-stack.md
│       ├── ...
│       └── languages/
└── dist/                     # 编译输出
```

## 工具映射规则

| 工具 | 推荐路径 | 格式 | 支持 Link | 备注 |
|------|---------|------|-----------|------|
| Claude Code | `.claude/rules/*.md` | Markdown | ✓ | 支持子目录、symlinks |
| Cursor | `.cursor/rules/*.mdc` | MDC (带 YAML frontmatter) | ✗ | `.cursorrules` 已 deprecated |
| Cline | `.clinerules/` 目录或 `.clinerules` 文件 | Markdown | ✓ | 支持 `AGENTS.md` |
| Roo Code | `.roo/rules/*.md` | Markdown | ✓ | `.roorules` 已 deprecated |
| Kilo Code | `.kilocode/rules/*.md` | Markdown | ✓ | - |
| Windsurf | `.windsurf/rules/*.md` | Markdown | ✓ | 6000 字符限制 |
| OpenCode | `AGENTS.md` | Markdown | ✗ | 单文件，需合并 |
| TRAE | `.trae/rules/*.md` | Markdown | ✓ | - |
| Goose | `goosehints` 或 `AGENTS.md` | Markdown | ✗ | 单文件，需合并 |

**特殊处理：**

- **Cursor**：需要生成 `.mdc` 文件（添加 YAML frontmatter），只能 copy
- **OpenCode/Goose**：需要合并成单文件，只能 copy

## 合并优先级

生成单文件时，按以下顺序合并（重要内容在前）：

| 顺序 | 内容 | 理由 |
|------|------|------|
| 1 | `01-tech-stack.md` | 先让 AI 知道技术栈上下文 |
| 2 | `02-coding-principles.md` | 核心行为规则，指导后续所有决策 |
| 3 | `languages/*.md` | 语言特定风格，紧跟编码原则 |
| 4 | `03-architecture.md` | 项目结构规则 |
| 5 | `04-testing.md` | 测试规则 |
| 6 | `05-git-commit.md` | 工作流规则 |
| 7 | `06-code-review.md` | 工作流规则 |

## 边界情况处理

| 场景 | 处理方式 |
|------|---------|
| `~/.rules-manager/` 不存在 | `init` 时提示先运行 `setup` |
| 目标目录已有 rules 文件 | 询问：覆盖 / 跳过 / 备份后覆盖 |
| 选择的语言在 `languages/` 中不存在 | 报错并停止执行 |
| symlink 目标文件被删除 | `sync` 时检测到断链，提示用户 |
| Cursor 的 `.mdc` 格式转换 | 自动添加默认 frontmatter：`alwaysApply: true` |
| 单文件合并超出字符限制 | 合并前预检，超限则报错停止 |
| 项目已有同工具的部分 rules | 智能合并：保留项目特有的，添加缺失的 |
| 无写入权限 | 明确报错，提示检查目录权限 |

### Cursor `.mdc` 转换示例

源文件 `01-tech-stack.md`：

```markdown
# Tech Stack
- Use React 18 with TypeScript
- Prefer pnpm over npm
```

生成的 `.cursor/rules/01-tech-stack.mdc`：

```markdown
---
alwaysApply: true
---
# Tech Stack
- Use React 18 with TypeScript
- Prefer pnpm over npm
```

### 字符限制预检示例

```
$ npx rulesmgr init --tools=windsurf --lang=typescript,python

Calculating merged file size...
✗ Error: Merged rules exceed Windsurf limit

  Total: 7,234 characters
  Limit: 6,000 characters
  Over:  1,234 characters

Please reduce rules content or remove some rules/languages.
```

## CLI 交互流程示例

### `rulesmgr setup`

```
$ npx rulesmgr setup

✓ Created ~/.rules-manager/
✓ Created example rules:
  - 01-tech-stack.md
  - 02-coding-principles.md
  - 03-architecture.md
  - 04-testing.md
  - 05-git-commit.md
  - 06-code-review.md
  - languages/typescript-coding-style.md
  - languages/python-coding-style.md

Setup complete! Edit the rules in ~/.rules-manager/ to customize.
```

### `rulesmgr init`（交互模式）

```
$ npx rulesmgr init

? Select target tools: (多选)
  ◉ Claude Code
  ◉ Cursor
  ◯ Cline
  ◯ Roo Code
  ...

? Select languages: (多选)
  ◉ TypeScript
  ◯ Python
  ◯ Go
  ...

? Deployment mode:
  ◉ Link (recommended)
  ◯ Copy

Deploying rules...
✓ .claude/rules/ (6 files linked)
✓ .cursor/rules/ (6 files copied, .mdc format)

Done! Rules deployed to current project.
```

### `rulesmgr sync`

```
$ npx rulesmgr sync

Scanning project rules...
Found 6 copied files (not symlinks)

Checking for changes...
⚠ 02-coding-principles.md has local modifications

? How to handle modified files:
  ◯ Overwrite all
  ◉ Skip modified
  ◯ Show diff

Syncing...
✓ 5 files updated
⊘ 1 file skipped (locally modified)
```

## 工具适配器设计

```typescript
// src/tools/base.ts
export interface RuleFile {
  name: string;
  path: string;
  content: string;
  priority: number;
}

export interface DeployedRule {
  name: string;
  path: string;
  isSymlink: boolean;
  modifiedLocally?: boolean;
}

export abstract class ToolAdapter {
  abstract name: string;
  abstract targetPath: string;        // 如 ".claude/rules"
  abstract supportsMultiFile: boolean;
  abstract supportsLink: boolean;
  abstract charLimit?: number;        // 字符限制（如 Windsurf 6000）

  // 部署规则到项目
  abstract deploy(rules: RuleFile[], mode: 'link' | 'copy'): void;

  // 扫描项目中已有的规则文件
  abstract scan(projectDir: string): DeployedRule[];
}
```

## 参考资料

- [Claude Code Rules](https://docs.anthropic.com/)
- [Cursor Rules for AI](https://docs.cursor.com/context/rules-for-ai)
- [Cline Rules](https://docs.cline.bot/features/cline-rules)
- [Roo Code Custom Instructions](https://docs.roocode.com/features/custom-instructions)
- [Kilo Code Custom Rules](https://blog.kilo.ai/p/extending-kilo-code-ai-with-custom)
- [Windsurf Rules](https://docs.windsurf.com/)
- [OpenCode Rules](https://opencode.ai/docs/rules/)
- [TRAE Rules](https://docs.trae.ai/ide/rules)
- [Goose GitHub](https://github.com/block/goose)
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Cursor Rules Best Practices](https://medium.com/elementor-engineers/cursor-rules-best-practices-for-developers-16a438a4935c)
