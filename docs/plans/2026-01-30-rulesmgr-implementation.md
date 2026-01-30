# rulesmgr Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a CLI tool that unifies AI coding tool rules management across Claude Code, Cursor, Cline, and 6 other tools.

**Architecture:** Node.js CLI with commander for argument parsing and inquirer for interactive prompts. Tool adapters pattern for supporting multiple AI tools. Templates stored in src/templates/, copied to ~/.rules-manager/ on setup.

**Tech Stack:** TypeScript, Node.js, commander, inquirer, tsup (bundler)

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Initialize npm project**

Run: `npm init -y`

**Step 2: Update package.json with correct configuration**

```json
{
  "name": "rulesmgr",
  "version": "0.1.0",
  "description": "Unified rules manager for AI coding tools",
  "type": "module",
  "bin": {
    "rulesmgr": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["ai", "coding", "rules", "claude", "cursor", "cline"],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create .gitignore**

```
node_modules/
dist/
*.log
.DS_Store
```

**Step 5: Install dependencies**

Run: `npm install commander inquirer`
Run: `npm install -D typescript tsup vitest @types/node @types/inquirer`

**Step 6: Create tsup.config.ts**

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
```

**Step 7: Commit**

```bash
git add package.json tsconfig.json .gitignore tsup.config.ts
git commit -m "chore: initialize project with TypeScript and dependencies"
```

---

## Task 2: CLI Entry Point and Command Structure

**Files:**
- Create: `src/index.ts`
- Create: `src/commands/setup.ts`
- Create: `src/commands/init.ts`
- Create: `src/commands/sync.ts`

**Step 1: Create CLI entry point**

Create `src/index.ts`:

```typescript
import { Command } from 'commander';
import { setupCommand } from './commands/setup.js';
import { initCommand } from './commands/init.js';
import { syncCommand } from './commands/sync.js';

const program = new Command();

program
  .name('rulesmgr')
  .description('Unified rules manager for AI coding tools')
  .version('0.1.0');

program.addCommand(setupCommand);
program.addCommand(initCommand);
program.addCommand(syncCommand);

program.parse();
```

**Step 2: Create setup command stub**

Create `src/commands/setup.ts`:

```typescript
import { Command } from 'commander';

export const setupCommand = new Command('setup')
  .description('Initialize ~/.rules-manager/ with example rules')
  .action(async () => {
    console.log('Setup command - not yet implemented');
  });
```

**Step 3: Create init command stub**

Create `src/commands/init.ts`:

```typescript
import { Command } from 'commander';

export const initCommand = new Command('init')
  .description('Deploy rules to current project')
  .option('--tools <tools>', 'Comma-separated list of target tools')
  .option('--lang <languages>', 'Comma-separated list of languages')
  .option('--rules <rules>', 'Comma-separated list of rules (default: all)')
  .option('--copy', 'Use copy mode instead of symlink')
  .action(async (options) => {
    console.log('Init command - not yet implemented', options);
  });
```

**Step 4: Create sync command stub**

Create `src/commands/sync.ts`:

```typescript
import { Command } from 'commander';

export const syncCommand = new Command('sync')
  .description('Sync copied rules with source')
  .action(async () => {
    console.log('Sync command - not yet implemented');
  });
```

**Step 5: Build and test CLI**

Run: `npm run build`
Run: `node dist/index.js --help`

Expected output should show three commands: setup, init, sync

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add CLI entry point and command stubs"
```

---

## Task 3: Constants and Types

**Files:**
- Create: `src/constants.ts`
- Create: `src/types.ts`

**Step 1: Create constants file**

Create `src/constants.ts`:

```typescript
import { homedir } from 'os';
import { join } from 'path';

export const RULES_MANAGER_DIR = join(homedir(), '.rules-manager');
export const LANGUAGES_DIR = 'languages';

export const SUPPORTED_TOOLS = [
  'claude-code',
  'cursor',
  'cline',
  'roo-code',
  'kilo-code',
  'windsurf',
  'opencode',
  'trae',
  'goose',
] as const;

export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'claude-code': 'Claude Code',
  'cursor': 'Cursor',
  'cline': 'Cline',
  'roo-code': 'Roo Code',
  'kilo-code': 'Kilo Code',
  'windsurf': 'Windsurf',
  'opencode': 'OpenCode',
  'trae': 'TRAE',
  'goose': 'Goose',
};

export const DEFAULT_LANGUAGES = [
  'typescript',
  'python',
  'go',
  'rust',
] as const;
```

**Step 2: Create types file**

Create `src/types.ts`:

```typescript
import { SUPPORTED_TOOLS } from './constants.js';

export type ToolName = typeof SUPPORTED_TOOLS[number];

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

export interface InitOptions {
  tools?: string;
  lang?: string;
  rules?: string;
  copy?: boolean;
}

export interface ToolConfig {
  name: ToolName;
  displayName: string;
  targetPath: string;
  supportsMultiFile: boolean;
  supportsLink: boolean;
  charLimit?: number;
  fileExtension: string;
}
```

**Step 3: Commit**

```bash
git add src/constants.ts src/types.ts
git commit -m "feat: add constants and types"
```

---

## Task 4: Tool Configurations

**Files:**
- Create: `src/tools/configs.ts`

**Step 1: Create tool configurations**

Create `src/tools/configs.ts`:

```typescript
import { ToolConfig } from '../types.js';

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  'claude-code': {
    name: 'claude-code',
    displayName: 'Claude Code',
    targetPath: '.claude/rules',
    supportsMultiFile: true,
    supportsLink: true,
    fileExtension: '.md',
  },
  'cursor': {
    name: 'cursor',
    displayName: 'Cursor',
    targetPath: '.cursor/rules',
    supportsMultiFile: true,
    supportsLink: false, // requires .mdc format with frontmatter
    fileExtension: '.mdc',
  },
  'cline': {
    name: 'cline',
    displayName: 'Cline',
    targetPath: '.clinerules',
    supportsMultiFile: true,
    supportsLink: true,
    fileExtension: '.md',
  },
  'roo-code': {
    name: 'roo-code',
    displayName: 'Roo Code',
    targetPath: '.roo/rules',
    supportsMultiFile: true,
    supportsLink: true,
    fileExtension: '.md',
  },
  'kilo-code': {
    name: 'kilo-code',
    displayName: 'Kilo Code',
    targetPath: '.kilocode/rules',
    supportsMultiFile: true,
    supportsLink: true,
    fileExtension: '.md',
  },
  'windsurf': {
    name: 'windsurf',
    displayName: 'Windsurf',
    targetPath: '.windsurf/rules',
    supportsMultiFile: true,
    supportsLink: true,
    charLimit: 6000,
    fileExtension: '.md',
  },
  'opencode': {
    name: 'opencode',
    displayName: 'OpenCode',
    targetPath: 'AGENTS.md',
    supportsMultiFile: false,
    supportsLink: false,
    fileExtension: '.md',
  },
  'trae': {
    name: 'trae',
    displayName: 'TRAE',
    targetPath: '.trae/rules',
    supportsMultiFile: true,
    supportsLink: true,
    fileExtension: '.md',
  },
  'goose': {
    name: 'goose',
    displayName: 'Goose',
    targetPath: 'goosehints',
    supportsMultiFile: false,
    supportsLink: false,
    fileExtension: '',
  },
};
```

**Step 2: Commit**

```bash
git add src/tools/configs.ts
git commit -m "feat: add tool configurations for all 9 supported tools"
```

---

## Task 5: Rule Templates

**Files:**
- Create: `src/templates/01-tech-stack.md`
- Create: `src/templates/02-coding-principles.md`
- Create: `src/templates/03-architecture.md`
- Create: `src/templates/04-testing.md`
- Create: `src/templates/05-git-commit.md`
- Create: `src/templates/06-code-review.md`
- Create: `src/templates/languages/typescript-coding-style.md`
- Create: `src/templates/languages/python-coding-style.md`

**Step 1: Create tech-stack template**

Create `src/templates/01-tech-stack.md`:

```markdown
# Tech Stack

## Languages
- Primary: [Your primary language]
- Secondary: [Other languages if applicable]

## Frameworks
- Frontend: [e.g., React, Vue, Angular]
- Backend: [e.g., Express, FastAPI, Go stdlib]

## Build Tools
- Package manager: [e.g., pnpm, npm, yarn]
- Bundler: [e.g., Vite, webpack, esbuild]

## Preferences
- Prefer standard library over external dependencies when reasonable
- Use well-maintained, typed libraries
- Avoid deprecated APIs
```

**Step 2: Create coding-principles template**

Create `src/templates/02-coding-principles.md`:

```markdown
# Coding Principles

## Core Rules
- SEARCH FIRST: Check existing code before implementing new functionality
- REUSE FIRST: Extend existing patterns before creating new ones
- MINIMAL CHANGES: Make the smallest change that solves the problem
- NO SPECULATION: Don't add features "just in case"

## Code Quality
- Write self-documenting code with clear names
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3 levels)
- Handle errors explicitly, don't swallow exceptions

## DRY & YAGNI
- Don't repeat yourself, but don't over-abstract prematurely
- Three similar instances before extracting to abstraction
- You Aren't Gonna Need It - build for today's requirements
```

**Step 3: Create architecture template**

Create `src/templates/03-architecture.md`:

```markdown
# Architecture

## Directory Structure
- Keep related code together
- Separate concerns: UI, business logic, data access
- Use index files sparingly

## Module Design
- Clear public interfaces
- Hide implementation details
- Avoid circular dependencies

## Naming Conventions
- Files: kebab-case
- Classes: PascalCase
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
```

**Step 4: Create testing template**

Create `src/templates/04-testing.md`:

```markdown
# Testing

## Test-Driven Development
- Write failing test first
- Implement minimal code to pass
- Refactor with confidence

## Test Structure
- Arrange: Set up test data
- Act: Execute the code under test
- Assert: Verify the result

## Coverage
- Focus on behavior, not implementation
- Test edge cases and error paths
- Don't test trivial code (getters/setters)

## Naming
- test_[function]_[scenario]_[expected]
- Example: test_login_invalidPassword_returnsError
```

**Step 5: Create git-commit template**

Create `src/templates/05-git-commit.md`:

```markdown
# Git Commit

## Commit Message Format
```
<type>: <description>

[optional body]
```

## Types
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting, no code change
- refactor: Code change that neither fixes bug nor adds feature
- test: Adding or updating tests
- chore: Build process, dependencies, etc.

## Rules
- Use imperative mood: "add feature" not "added feature"
- Keep subject line under 50 characters
- Wrap body at 72 characters
- Commit early and often
- One logical change per commit
```

**Step 6: Create code-review template**

Create `src/templates/06-code-review.md`:

```markdown
# Code Review

## Before Submitting
- Self-review your changes
- Ensure tests pass
- Check for debug code, console.logs
- Verify no secrets or credentials

## Review Checklist
- Does the code do what it claims?
- Are there any obvious bugs?
- Is error handling adequate?
- Is the code readable and maintainable?
- Are there any security concerns?

## Feedback Style
- Be constructive, not critical
- Explain the "why" behind suggestions
- Distinguish between blocking issues and suggestions
```

**Step 7: Create TypeScript coding style**

Create `src/templates/languages/typescript-coding-style.md`:

```markdown
# TypeScript Coding Style

## Type Safety
- Enable strict mode
- Avoid `any`, use `unknown` if type is truly unknown
- Prefer interfaces over type aliases for objects
- Use const assertions for literal types

## Functions
- Use explicit return types for public functions
- Prefer arrow functions for callbacks
- Use optional parameters over undefined unions

## Imports
- Use named imports over default imports
- Group imports: external, internal, relative
- Use `.js` extension for relative imports (ESM)

## Async
- Prefer async/await over .then() chains
- Always handle promise rejections
- Use Promise.all() for parallel operations
```

**Step 8: Create Python coding style**

Create `src/templates/languages/python-coding-style.md`:

```markdown
# Python Coding Style

## Style Guide
- Follow PEP 8
- Use 4 spaces for indentation
- Max line length: 88 characters (Black default)

## Type Hints
- Use type hints for function signatures
- Use `from __future__ import annotations` for forward refs
- Prefer `list[str]` over `List[str]` (Python 3.9+)

## Imports
- Standard library first, then third-party, then local
- Use absolute imports over relative
- Avoid wildcard imports

## Functions
- Use docstrings for public functions
- Keep functions under 20 lines
- Use `*` and `/` to enforce keyword/positional args
```

**Step 9: Commit**

```bash
git add src/templates/
git commit -m "feat: add rule templates for setup command"
```

---

## Task 6: File System Utilities

**Files:**
- Create: `src/utils/fs.ts`
- Create: `src/utils/fs.test.ts`

**Step 1: Write tests for fs utilities**

Create `src/utils/fs.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { ensureDir, copyFile, linkFile, isSymlink, readFileContent, getFilesInDir } from './fs.js';

describe('fs utilities', () => {
  const testDir = join(tmpdir(), 'rulesmgr-test-' + Date.now());

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('ensureDir', () => {
    it('creates directory if not exists', () => {
      const dir = join(testDir, 'new-dir');
      ensureDir(dir);
      expect(existsSync(dir)).toBe(true);
    });

    it('does nothing if directory exists', () => {
      const dir = join(testDir, 'existing-dir');
      mkdirSync(dir);
      expect(() => ensureDir(dir)).not.toThrow();
    });
  });

  describe('copyFile', () => {
    it('copies file content', () => {
      const src = join(testDir, 'source.txt');
      const dest = join(testDir, 'dest.txt');
      writeFileSync(src, 'hello');
      copyFile(src, dest);
      expect(readFileContent(dest)).toBe('hello');
    });
  });

  describe('linkFile', () => {
    it('creates symlink', () => {
      const src = join(testDir, 'source.txt');
      const dest = join(testDir, 'link.txt');
      writeFileSync(src, 'hello');
      linkFile(src, dest);
      expect(isSymlink(dest)).toBe(true);
      expect(readFileContent(dest)).toBe('hello');
    });
  });

  describe('getFilesInDir', () => {
    it('returns files sorted by name', () => {
      writeFileSync(join(testDir, '02-second.md'), '');
      writeFileSync(join(testDir, '01-first.md'), '');
      const files = getFilesInDir(testDir);
      expect(files.map(f => f.name)).toEqual(['01-first.md', '02-second.md']);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - module not found

**Step 3: Implement fs utilities**

Create `src/utils/fs.ts`:

```typescript
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  symlinkSync,
  lstatSync,
  readFileSync,
  readdirSync,
  unlinkSync,
} from 'fs';
import { dirname, join } from 'path';

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function copyFile(src: string, dest: string): void {
  ensureDir(dirname(dest));
  copyFileSync(src, dest);
}

export function linkFile(src: string, dest: string): void {
  ensureDir(dirname(dest));
  if (existsSync(dest)) {
    unlinkSync(dest);
  }
  symlinkSync(src, dest);
}

export function isSymlink(path: string): boolean {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

export function readFileContent(path: string): string {
  return readFileSync(path, 'utf-8');
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export interface FileInfo {
  name: string;
  path: string;
}

export function getFilesInDir(dir: string, extension?: string): FileInfo[] {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile())
    .filter(e => !extension || e.name.endsWith(extension))
    .map(e => ({
      name: e.name,
      path: join(dir, e.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return files;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/utils/fs.ts src/utils/fs.test.ts
git commit -m "feat: add file system utilities with tests"
```

---

## Task 7: Rule Merging Utilities

**Files:**
- Create: `src/utils/merge.ts`
- Create: `src/utils/merge.test.ts`

**Step 1: Write tests for merge utilities**

Create `src/utils/merge.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { mergeRules, calculateMergedSize, sortByPriority } from './merge.js';
import { RuleFile } from '../types.js';

describe('merge utilities', () => {
  const makeRule = (name: string, content: string, priority: number): RuleFile => ({
    name,
    path: `/path/${name}`,
    content,
    priority,
  });

  describe('sortByPriority', () => {
    it('sorts rules by priority ascending', () => {
      const rules = [
        makeRule('c', 'c', 3),
        makeRule('a', 'a', 1),
        makeRule('b', 'b', 2),
      ];
      const sorted = sortByPriority(rules);
      expect(sorted.map(r => r.name)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('mergeRules', () => {
    it('merges rules with headers', () => {
      const rules = [
        makeRule('01-first.md', 'First content', 1),
        makeRule('02-second.md', 'Second content', 2),
      ];
      const merged = mergeRules(rules);
      expect(merged).toContain('# 01-first');
      expect(merged).toContain('First content');
      expect(merged).toContain('# 02-second');
      expect(merged).toContain('Second content');
      expect(merged.indexOf('First')).toBeLessThan(merged.indexOf('Second'));
    });
  });

  describe('calculateMergedSize', () => {
    it('calculates total character count', () => {
      const rules = [
        makeRule('a', '12345', 1),
        makeRule('b', '67890', 2),
      ];
      const size = calculateMergedSize(rules);
      // Content + headers + separators
      expect(size).toBeGreaterThan(10);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - module not found

**Step 3: Implement merge utilities**

Create `src/utils/merge.ts`:

```typescript
import { RuleFile } from '../types.js';

export function sortByPriority(rules: RuleFile[]): RuleFile[] {
  return [...rules].sort((a, b) => a.priority - b.priority);
}

export function mergeRules(rules: RuleFile[]): string {
  const sorted = sortByPriority(rules);
  const sections = sorted.map(rule => {
    const title = rule.name.replace(/\.\w+$/, ''); // Remove extension
    return `# ${title}\n\n${rule.content.trim()}`;
  });
  return sections.join('\n\n---\n\n');
}

export function calculateMergedSize(rules: RuleFile[]): number {
  return mergeRules(rules).length;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/utils/merge.ts src/utils/merge.test.ts
git commit -m "feat: add rule merging utilities with tests"
```

---

## Task 8: Rule Loading Service

**Files:**
- Create: `src/services/rules.ts`
- Create: `src/services/rules.test.ts`

**Step 1: Write tests for rules service**

Create `src/services/rules.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { RulesService } from './rules.js';

describe('RulesService', () => {
  const testDir = join(tmpdir(), 'rulesmgr-rules-test-' + Date.now());
  let service: RulesService;

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
    mkdirSync(join(testDir, 'languages'), { recursive: true });
    service = new RulesService(testDir);
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('getAvailableRules', () => {
    it('returns rules sorted by priority', () => {
      writeFileSync(join(testDir, '02-second.md'), 'second');
      writeFileSync(join(testDir, '01-first.md'), 'first');
      const rules = service.getAvailableRules();
      expect(rules.map(r => r.name)).toEqual(['01-first.md', '02-second.md']);
    });

    it('extracts priority from filename', () => {
      writeFileSync(join(testDir, '05-test.md'), 'content');
      const rules = service.getAvailableRules();
      expect(rules[0].priority).toBe(5);
    });
  });

  describe('getAvailableLanguages', () => {
    it('returns language names without extension', () => {
      writeFileSync(join(testDir, 'languages/typescript-coding-style.md'), 'ts');
      writeFileSync(join(testDir, 'languages/python-coding-style.md'), 'py');
      const langs = service.getAvailableLanguages();
      expect(langs).toContain('typescript');
      expect(langs).toContain('python');
    });
  });

  describe('getLanguageRule', () => {
    it('returns language rule file', () => {
      writeFileSync(join(testDir, 'languages/typescript-coding-style.md'), 'ts content');
      const rule = service.getLanguageRule('typescript');
      expect(rule?.content).toBe('ts content');
    });

    it('returns undefined for missing language', () => {
      const rule = service.getLanguageRule('nonexistent');
      expect(rule).toBeUndefined();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - module not found

**Step 3: Implement rules service**

Create `src/services/rules.ts`:

```typescript
import { join } from 'path';
import { RuleFile } from '../types.js';
import { getFilesInDir, readFileContent, fileExists } from '../utils/fs.js';
import { LANGUAGES_DIR } from '../constants.js';

export class RulesService {
  constructor(private rulesDir: string) {}

  getAvailableRules(): RuleFile[] {
    const files = getFilesInDir(this.rulesDir, '.md');
    return files.map(f => ({
      name: f.name,
      path: f.path,
      content: readFileContent(f.path),
      priority: this.extractPriority(f.name),
    }));
  }

  getAvailableLanguages(): string[] {
    const langDir = join(this.rulesDir, LANGUAGES_DIR);
    const files = getFilesInDir(langDir, '.md');
    return files.map(f => this.extractLanguageName(f.name));
  }

  getLanguageRule(language: string): RuleFile | undefined {
    const langDir = join(this.rulesDir, LANGUAGES_DIR);
    const fileName = `${language}-coding-style.md`;
    const filePath = join(langDir, fileName);

    if (!fileExists(filePath)) {
      return undefined;
    }

    return {
      name: fileName,
      path: filePath,
      content: readFileContent(filePath),
      priority: 2.5, // Between 02-coding-principles and 03-architecture
    };
  }

  getRuleByName(name: string): RuleFile | undefined {
    const rules = this.getAvailableRules();
    return rules.find(r => r.name === name || r.name === `${name}.md`);
  }

  private extractPriority(filename: string): number {
    const match = filename.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 99;
  }

  private extractLanguageName(filename: string): string {
    return filename.replace(/-coding-style\.md$/, '');
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/services/rules.ts src/services/rules.test.ts
git commit -m "feat: add rules loading service with tests"
```

---

## Task 9: Setup Command Implementation

**Files:**
- Modify: `src/commands/setup.ts`

**Step 1: Write integration test for setup**

Create `src/commands/setup.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { executeSetup } from './setup.js';

describe('setup command', () => {
  const testDir = join(tmpdir(), 'rulesmgr-setup-test-' + Date.now());

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('creates rules directory with templates', async () => {
    await executeSetup(testDir);

    expect(existsSync(join(testDir, '01-tech-stack.md'))).toBe(true);
    expect(existsSync(join(testDir, '02-coding-principles.md'))).toBe(true);
    expect(existsSync(join(testDir, 'languages/typescript-coding-style.md'))).toBe(true);
  });

  it('does not overwrite existing files', async () => {
    mkdirSync(testDir, { recursive: true });
    const { writeFileSync } = await import('fs');
    writeFileSync(join(testDir, '01-tech-stack.md'), 'custom content');

    await executeSetup(testDir);

    const { readFileSync } = await import('fs');
    const content = readFileSync(join(testDir, '01-tech-stack.md'), 'utf-8');
    expect(content).toBe('custom content');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - executeSetup not found

**Step 3: Implement setup command**

Update `src/commands/setup.ts`:

```typescript
import { Command } from 'commander';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { RULES_MANAGER_DIR, LANGUAGES_DIR } from '../constants.js';
import { ensureDir } from '../utils/fs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

export async function executeSetup(targetDir: string = RULES_MANAGER_DIR): Promise<void> {
  console.log(`Setting up rules directory at ${targetDir}...`);

  ensureDir(targetDir);
  ensureDir(join(targetDir, LANGUAGES_DIR));

  // Copy root templates
  copyTemplates(TEMPLATES_DIR, targetDir);

  // Copy language templates
  const langTemplatesDir = join(TEMPLATES_DIR, LANGUAGES_DIR);
  const langTargetDir = join(targetDir, LANGUAGES_DIR);
  copyTemplates(langTemplatesDir, langTargetDir);

  console.log('\n✓ Setup complete!');
  console.log(`\nEdit your rules in ${targetDir}`);
}

function copyTemplates(srcDir: string, destDir: string): void {
  if (!existsSync(srcDir)) {
    return;
  }

  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const srcPath = join(srcDir, entry.name);
      const destPath = join(destDir, entry.name);

      if (existsSync(destPath)) {
        console.log(`  ⊘ Skipped ${entry.name} (already exists)`);
      } else {
        const content = readFileSync(srcPath, 'utf-8');
        writeFileSync(destPath, content);
        console.log(`  ✓ Created ${entry.name}`);
      }
    }
  }
}

export const setupCommand = new Command('setup')
  .description('Initialize ~/.rules-manager/ with example rules')
  .action(async () => {
    await executeSetup();
  });
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Build and test manually**

Run: `npm run build`
Run: `node dist/index.js setup`

Expected: Creates ~/.rules-manager/ with template files

**Step 6: Commit**

```bash
git add src/commands/setup.ts src/commands/setup.test.ts
git commit -m "feat: implement setup command"
```

---

## Task 10: Interactive Prompts

**Files:**
- Create: `src/utils/prompts.ts`

**Step 1: Create prompts utility**

Create `src/utils/prompts.ts`:

```typescript
import inquirer from 'inquirer';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { ToolName } from '../types.js';

export async function promptTools(availableTools: string[]): Promise<string[]> {
  const choices = availableTools.map(tool => ({
    name: TOOL_CONFIGS[tool]?.displayName || tool,
    value: tool,
  }));

  const { tools } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tools',
      message: 'Select target tools:',
      choices,
      validate: (answer: string[]) => {
        if (answer.length === 0) {
          return 'You must select at least one tool.';
        }
        return true;
      },
    },
  ]);

  return tools;
}

export async function promptLanguages(availableLanguages: string[]): Promise<string[]> {
  const choices = availableLanguages.map(lang => ({
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    value: lang,
  }));

  const { languages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Select languages:',
      choices,
      validate: (answer: string[]) => {
        if (answer.length === 0) {
          return 'You must select at least one language.';
        }
        return true;
      },
    },
  ]);

  return languages;
}

export async function promptDeployMode(): Promise<'link' | 'copy'> {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Deployment mode:',
      choices: [
        { name: 'Link (recommended)', value: 'link' },
        { name: 'Copy', value: 'copy' },
      ],
      default: 'link',
    },
  ]);

  return mode;
}

export async function promptOverwrite(filename: string): Promise<'overwrite' | 'skip' | 'diff'> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `${filename} has local modifications. How to handle?`,
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Skip', value: 'skip' },
        { name: 'Show diff', value: 'diff' },
      ],
    },
  ]);

  return action;
}
```

**Step 2: Commit**

```bash
git add src/utils/prompts.ts
git commit -m "feat: add interactive prompt utilities"
```

---

## Task 11: Tool Deployer Service

**Files:**
- Create: `src/services/deployer.ts`
- Create: `src/services/deployer.test.ts`

**Step 1: Write tests for deployer**

Create `src/services/deployer.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { Deployer } from './deployer.js';
import { RuleFile } from '../types.js';
import { isSymlink } from '../utils/fs.js';

describe('Deployer', () => {
  const testDir = join(tmpdir(), 'rulesmgr-deployer-test-' + Date.now());
  const sourceDir = join(testDir, 'source');
  const projectDir = join(testDir, 'project');

  beforeEach(() => {
    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  const makeRule = (name: string, content: string): RuleFile => {
    const path = join(sourceDir, name);
    writeFileSync(path, content);
    return { name, path, content, priority: 1 };
  };

  describe('deployMultiFile', () => {
    it('creates symlinks in link mode', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);

      deployer.deployMultiFile(rules, '.claude/rules', 'link', '.md');

      const targetPath = join(projectDir, '.claude/rules/test.md');
      expect(existsSync(targetPath)).toBe(true);
      expect(isSymlink(targetPath)).toBe(true);
    });

    it('copies files in copy mode', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);

      deployer.deployMultiFile(rules, '.claude/rules', 'copy', '.md');

      const targetPath = join(projectDir, '.claude/rules/test.md');
      expect(existsSync(targetPath)).toBe(true);
      expect(isSymlink(targetPath)).toBe(false);
      expect(readFileSync(targetPath, 'utf-8')).toBe('content');
    });
  });

  describe('deploySingleFile', () => {
    it('merges rules into single file', () => {
      const rules = [
        makeRule('01-first.md', 'first'),
        makeRule('02-second.md', 'second'),
      ];
      const deployer = new Deployer(projectDir);

      deployer.deploySingleFile(rules, 'AGENTS.md');

      const content = readFileSync(join(projectDir, 'AGENTS.md'), 'utf-8');
      expect(content).toContain('first');
      expect(content).toContain('second');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - module not found

**Step 3: Implement deployer service**

Create `src/services/deployer.ts`:

```typescript
import { join, basename } from 'path';
import { RuleFile, ToolConfig } from '../types.js';
import { ensureDir, copyFile, linkFile } from '../utils/fs.js';
import { mergeRules, calculateMergedSize } from '../utils/merge.js';
import { writeFileSync } from 'fs';

export class Deployer {
  constructor(private projectDir: string) {}

  deploy(
    rules: RuleFile[],
    toolConfig: ToolConfig,
    mode: 'link' | 'copy'
  ): void {
    const effectiveMode = toolConfig.supportsLink ? mode : 'copy';

    if (toolConfig.supportsMultiFile) {
      this.deployMultiFile(rules, toolConfig.targetPath, effectiveMode, toolConfig.fileExtension);
    } else {
      // Check character limit before merging
      if (toolConfig.charLimit) {
        const size = calculateMergedSize(rules);
        if (size > toolConfig.charLimit) {
          throw new Error(
            `Merged rules exceed ${toolConfig.displayName} limit.\n` +
            `  Total: ${size} characters\n` +
            `  Limit: ${toolConfig.charLimit} characters\n` +
            `  Over: ${size - toolConfig.charLimit} characters\n\n` +
            `Please reduce rules content or remove some rules/languages.`
          );
        }
      }
      this.deploySingleFile(rules, toolConfig.targetPath);
    }
  }

  deployMultiFile(
    rules: RuleFile[],
    targetPath: string,
    mode: 'link' | 'copy',
    extension: string
  ): void {
    const targetDir = join(this.projectDir, targetPath);
    ensureDir(targetDir);

    for (const rule of rules) {
      const targetName = this.getTargetFileName(rule.name, extension);
      const targetFile = join(targetDir, targetName);

      if (mode === 'link') {
        linkFile(rule.path, targetFile);
        console.log(`  ✓ Linked ${targetName}`);
      } else {
        const content = this.transformContent(rule.content, extension);
        writeFileSync(targetFile, content);
        console.log(`  ✓ Copied ${targetName}`);
      }
    }
  }

  deploySingleFile(rules: RuleFile[], targetPath: string): void {
    const targetFile = join(this.projectDir, targetPath);
    ensureDir(join(this.projectDir));

    const merged = mergeRules(rules);
    writeFileSync(targetFile, merged);
    console.log(`  ✓ Created ${targetPath} (${rules.length} rules merged)`);
  }

  private getTargetFileName(sourceName: string, targetExtension: string): string {
    const baseName = sourceName.replace(/\.\w+$/, '');
    return `${baseName}${targetExtension}`;
  }

  private transformContent(content: string, extension: string): string {
    // Add MDC frontmatter for Cursor
    if (extension === '.mdc') {
      return `---\nalwaysApply: true\n---\n${content}`;
    }
    return content;
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/services/deployer.ts src/services/deployer.test.ts
git commit -m "feat: add deployer service with tests"
```

---

## Task 12: Init Command Implementation

**Files:**
- Modify: `src/commands/init.ts`

**Step 1: Implement init command**

Update `src/commands/init.ts`:

```typescript
import { Command } from 'commander';
import { existsSync } from 'fs';
import { RULES_MANAGER_DIR, SUPPORTED_TOOLS } from '../constants.js';
import { InitOptions } from '../types.js';
import { RulesService } from '../services/rules.js';
import { Deployer } from '../services/deployer.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { promptTools, promptLanguages, promptDeployMode } from '../utils/prompts.js';
import { sortByPriority } from '../utils/merge.js';

export async function executeInit(options: InitOptions): Promise<void> {
  // Check if rules manager is set up
  if (!existsSync(RULES_MANAGER_DIR)) {
    console.error('Error: ~/.rules-manager/ does not exist.');
    console.error('Run "rulesmgr setup" first.');
    process.exit(1);
  }

  const rulesService = new RulesService(RULES_MANAGER_DIR);
  const deployer = new Deployer(process.cwd());

  // Get tools (from args or prompt)
  let tools: string[];
  if (options.tools) {
    tools = options.tools.split(',').map(t => t.trim());
  } else {
    tools = await promptTools([...SUPPORTED_TOOLS]);
  }

  // Validate tools
  for (const tool of tools) {
    if (!TOOL_CONFIGS[tool]) {
      console.error(`Error: Unknown tool "${tool}"`);
      process.exit(1);
    }
  }

  // Get languages (from args or prompt)
  const availableLanguages = rulesService.getAvailableLanguages();
  let languages: string[];
  if (options.lang) {
    languages = options.lang.split(',').map(l => l.trim());
    // Validate languages exist
    for (const lang of languages) {
      if (!availableLanguages.includes(lang)) {
        console.error(`Error: Language "${lang}" not found in ~/.rules-manager/languages/`);
        console.error(`Available languages: ${availableLanguages.join(', ')}`);
        process.exit(1);
      }
    }
  } else {
    languages = await promptLanguages(availableLanguages);
  }

  // Get deployment mode
  const mode = options.copy ? 'copy' : 'link';

  // Collect all rules
  const baseRules = rulesService.getAvailableRules();
  const languageRules = languages
    .map(lang => rulesService.getLanguageRule(lang))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  const allRules = sortByPriority([...baseRules, ...languageRules]);

  console.log(`\nDeploying ${allRules.length} rules to ${tools.length} tool(s)...\n`);

  // Deploy to each tool
  for (const tool of tools) {
    const config = TOOL_CONFIGS[tool];
    console.log(`${config.displayName}:`);

    try {
      deployer.deploy(allRules, config, mode);
    } catch (error) {
      console.error(`\n✗ Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  console.log('\n✓ Done! Rules deployed to current project.');
}

export const initCommand = new Command('init')
  .description('Deploy rules to current project')
  .option('--tools <tools>', 'Comma-separated list of target tools')
  .option('--lang <languages>', 'Comma-separated list of languages')
  .option('--rules <rules>', 'Comma-separated list of rules (default: all)')
  .option('--copy', 'Use copy mode instead of symlink')
  .action(async (options: InitOptions) => {
    await executeInit(options);
  });
```

**Step 2: Build and test**

Run: `npm run build`
Run: `node dist/index.js init --help`

**Step 3: Test manually in a temp directory**

Run: `cd /tmp && mkdir test-project && cd test-project`
Run: `npx /path/to/rulesmgr init --tools=claude-code --lang=typescript`

Expected: Creates .claude/rules/ with linked rule files

**Step 4: Commit**

```bash
git add src/commands/init.ts
git commit -m "feat: implement init command with tool deployment"
```

---

## Task 13: Sync Command Implementation

**Files:**
- Modify: `src/commands/sync.ts`
- Create: `src/utils/diff.ts`

**Step 1: Create diff utility**

Create `src/utils/diff.ts`:

```typescript
import { readFileSync } from 'fs';

export function filesAreDifferent(path1: string, path2: string): boolean {
  try {
    const content1 = readFileSync(path1, 'utf-8');
    const content2 = readFileSync(path2, 'utf-8');
    return content1 !== content2;
  } catch {
    return true;
  }
}

export function showDiff(localPath: string, sourcePath: string): void {
  const local = readFileSync(localPath, 'utf-8');
  const source = readFileSync(sourcePath, 'utf-8');

  console.log('\n--- Local (current) ---');
  console.log(local.slice(0, 500) + (local.length > 500 ? '\n...(truncated)' : ''));
  console.log('\n--- Source (new) ---');
  console.log(source.slice(0, 500) + (source.length > 500 ? '\n...(truncated)' : ''));
  console.log('');
}
```

**Step 2: Implement sync command**

Update `src/commands/sync.ts`:

```typescript
import { Command } from 'commander';
import { existsSync, readdirSync, copyFileSync } from 'fs';
import { join, basename } from 'path';
import { RULES_MANAGER_DIR, LANGUAGES_DIR } from '../constants.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { isSymlink, fileExists } from '../utils/fs.js';
import { filesAreDifferent, showDiff } from '../utils/diff.js';
import { promptOverwrite } from '../utils/prompts.js';

interface SyncTarget {
  localPath: string;
  sourcePath: string;
  name: string;
}

export async function executeSync(): Promise<void> {
  if (!existsSync(RULES_MANAGER_DIR)) {
    console.error('Error: ~/.rules-manager/ does not exist.');
    console.error('Run "rulesmgr setup" first.');
    process.exit(1);
  }

  const projectDir = process.cwd();
  const targets: SyncTarget[] = [];

  console.log('Scanning project for copied rules...\n');

  // Scan each tool's directory
  for (const [toolName, config] of Object.entries(TOOL_CONFIGS)) {
    const toolPath = join(projectDir, config.targetPath);

    if (!existsSync(toolPath)) {
      continue;
    }

    // For single-file tools
    if (!config.supportsMultiFile) {
      if (!isSymlink(toolPath)) {
        console.log(`Found: ${config.targetPath} (merged file - manual sync required)`);
      }
      continue;
    }

    // For multi-file tools
    const entries = readdirSync(toolPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const localPath = join(toolPath, entry.name);
      if (isSymlink(localPath)) continue; // Skip symlinks

      // Find source file
      const baseName = entry.name.replace(/\.mdc$/, '.md');
      let sourcePath = join(RULES_MANAGER_DIR, baseName);

      // Check languages directory
      if (!fileExists(sourcePath)) {
        sourcePath = join(RULES_MANAGER_DIR, LANGUAGES_DIR, baseName);
      }

      if (fileExists(sourcePath)) {
        targets.push({ localPath, sourcePath, name: entry.name });
      }
    }
  }

  if (targets.length === 0) {
    console.log('No copied rules found to sync.');
    return;
  }

  console.log(`Found ${targets.length} copied file(s)\n`);

  let updated = 0;
  let skipped = 0;

  for (const target of targets) {
    if (!filesAreDifferent(target.localPath, target.sourcePath)) {
      console.log(`  ✓ ${target.name} (already up to date)`);
      continue;
    }

    // Check if local file was modified
    const action = await promptOverwrite(target.name);

    if (action === 'diff') {
      showDiff(target.localPath, target.sourcePath);
      const secondAction = await promptOverwrite(target.name);
      if (secondAction === 'skip') {
        skipped++;
        console.log(`  ⊘ Skipped ${target.name}`);
        continue;
      }
    }

    if (action === 'skip') {
      skipped++;
      console.log(`  ⊘ Skipped ${target.name}`);
      continue;
    }

    // Overwrite
    copyFileSync(target.sourcePath, target.localPath);
    updated++;
    console.log(`  ✓ Updated ${target.name}`);
  }

  console.log(`\nSync complete: ${updated} updated, ${skipped} skipped`);
}

export const syncCommand = new Command('sync')
  .description('Sync copied rules with source')
  .action(async () => {
    await executeSync();
  });
```

**Step 3: Build and test**

Run: `npm run build`
Run: `node dist/index.js sync --help`

**Step 4: Commit**

```bash
git add src/commands/sync.ts src/utils/diff.ts
git commit -m "feat: implement sync command for copied rules"
```

---

## Task 14: Final Integration and Testing

**Files:**
- Update: `package.json`

**Step 1: Update package.json with files field**

Add to `package.json`:

```json
{
  "files": [
    "dist",
    "src/templates"
  ]
}
```

**Step 2: Build final version**

Run: `npm run build`

**Step 3: Run all tests**

Run: `npm test`

Expected: All tests pass

**Step 4: Test complete flow manually**

```bash
# Test setup
node dist/index.js setup

# Check created files
ls -la ~/.rules-manager/

# Test init in a temp project
cd /tmp && mkdir final-test && cd final-test
node /path/to/rulesmgr/dist/index.js init --tools=claude-code,cursor --lang=typescript

# Verify files
ls -la .claude/rules/
ls -la .cursor/rules/
```

**Step 5: Commit**

```bash
git add package.json
git commit -m "chore: finalize package configuration"
```

---

## Task 15: Documentation

**Files:**
- Create: `README.md`

**Step 1: Create README**

Create `README.md`:

```markdown
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
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with usage instructions"
```

---

## Summary

This plan implements rulesmgr in 15 tasks:

1. **Task 1-2**: Project setup and CLI structure
2. **Task 3-4**: Types, constants, and tool configurations
3. **Task 5**: Rule templates
4. **Task 6-7**: File system and merge utilities
5. **Task 8**: Rules loading service
6. **Task 9**: Setup command
7. **Task 10**: Interactive prompts
8. **Task 11**: Deployer service
9. **Task 12**: Init command
10. **Task 13**: Sync command
11. **Task 14**: Integration testing
12. **Task 15**: Documentation

Each task follows TDD with small, focused commits.
