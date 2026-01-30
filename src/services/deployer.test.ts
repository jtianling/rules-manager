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

    it('deploys multiple rules', () => {
      const rules = [
        makeRule('01-first.md', 'first content'),
        makeRule('02-second.md', 'second content'),
      ];
      const deployer = new Deployer(projectDir);

      deployer.deployMultiFile(rules, '.claude/rules', 'copy', '.md');

      expect(existsSync(join(projectDir, '.claude/rules/01-first.md'))).toBe(true);
      expect(existsSync(join(projectDir, '.claude/rules/02-second.md'))).toBe(true);
    });

    it('changes file extension when different', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);

      deployer.deployMultiFile(rules, '.cursor/rules', 'copy', '.mdc');

      const targetPath = join(projectDir, '.cursor/rules/test.mdc');
      expect(existsSync(targetPath)).toBe(true);
    });

    it('adds MDC frontmatter for .mdc extension in copy mode', () => {
      const rules = [makeRule('test.md', 'rule content')];
      const deployer = new Deployer(projectDir);

      deployer.deployMultiFile(rules, '.cursor/rules', 'copy', '.mdc');

      const content = readFileSync(join(projectDir, '.cursor/rules/test.mdc'), 'utf-8');
      expect(content).toContain('---');
      expect(content).toContain('alwaysApply: true');
      expect(content).toContain('rule content');
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

    it('creates parent directory if needed', () => {
      const rules = [makeRule('01-test.md', 'content')];
      const deployer = new Deployer(projectDir);

      deployer.deploySingleFile(rules, 'nested/dir/rules.md');

      expect(existsSync(join(projectDir, 'nested/dir/rules.md'))).toBe(true);
    });

    it('preserves rule order based on priority', () => {
      const rule1 = makeRule('02-second.md', 'second');
      rule1.priority = 2;
      const rule2 = makeRule('01-first.md', 'first');
      rule2.priority = 1;
      const deployer = new Deployer(projectDir);

      deployer.deploySingleFile([rule1, rule2], 'merged.md');

      const content = readFileSync(join(projectDir, 'merged.md'), 'utf-8');
      const firstIndex = content.indexOf('first');
      const secondIndex = content.indexOf('second');
      expect(firstIndex).toBeLessThan(secondIndex);
    });
  });

  describe('deploy', () => {
    it('uses deployMultiFile for multi-file tools', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);
      const toolConfig = {
        name: 'claude' as const,
        displayName: 'Claude',
        targetPath: '.claude/rules',
        supportsMultiFile: true,
        supportsLink: true,
        fileExtension: '.md',
      };

      deployer.deploy(rules, toolConfig, 'link');

      expect(existsSync(join(projectDir, '.claude/rules/test.md'))).toBe(true);
      expect(isSymlink(join(projectDir, '.claude/rules/test.md'))).toBe(true);
    });

    it('uses deploySingleFile for single-file tools', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);
      const toolConfig = {
        name: 'codex' as const,
        displayName: 'Codex',
        targetPath: 'AGENTS.md',
        supportsMultiFile: false,
        supportsLink: false,
        fileExtension: '.md',
      };

      deployer.deploy(rules, toolConfig, 'copy');

      expect(existsSync(join(projectDir, 'AGENTS.md'))).toBe(true);
    });

    it('falls back to copy mode when tool does not support links', () => {
      const rules = [makeRule('test.md', 'content')];
      const deployer = new Deployer(projectDir);
      const toolConfig = {
        name: 'cursor' as const,
        displayName: 'Cursor',
        targetPath: '.cursor/rules',
        supportsMultiFile: true,
        supportsLink: false,
        fileExtension: '.mdc',
      };

      deployer.deploy(rules, toolConfig, 'link'); // Request link, but tool doesn't support

      const targetPath = join(projectDir, '.cursor/rules/test.mdc');
      expect(existsSync(targetPath)).toBe(true);
      expect(isSymlink(targetPath)).toBe(false);
    });

    it('throws error when merged content exceeds char limit', () => {
      const longContent = 'x'.repeat(1000);
      const rules = [makeRule('test.md', longContent)];
      const deployer = new Deployer(projectDir);
      const toolConfig = {
        name: 'codex' as const,
        displayName: 'Codex',
        targetPath: 'AGENTS.md',
        supportsMultiFile: false,
        supportsLink: false,
        charLimit: 500,
        fileExtension: '.md',
      };

      expect(() => deployer.deploy(rules, toolConfig, 'copy')).toThrow(/exceed.*limit/i);
    });

    it('allows deployment when content is within char limit', () => {
      const rules = [makeRule('test.md', 'short content')];
      const deployer = new Deployer(projectDir);
      const toolConfig = {
        name: 'codex' as const,
        displayName: 'Codex',
        targetPath: 'AGENTS.md',
        supportsMultiFile: false,
        supportsLink: false,
        charLimit: 10000,
        fileExtension: '.md',
      };

      expect(() => deployer.deploy(rules, toolConfig, 'copy')).not.toThrow();
      expect(existsSync(join(projectDir, 'AGENTS.md'))).toBe(true);
    });
  });
});
