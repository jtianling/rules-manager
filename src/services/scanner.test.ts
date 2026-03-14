import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync, symlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { DeploymentScanner } from './scanner.js';

describe('DeploymentScanner', () => {
  const testDir = join(tmpdir(), 'rulesmgr-scanner-test-' + Date.now());
  const rulesManagerDir = join(testDir, 'rules-manager');
  const projectDir = join(testDir, 'project');

  beforeEach(() => {
    mkdirSync(rulesManagerDir, { recursive: true });
    mkdirSync(projectDir, { recursive: true });
    // Create known rules in rules-manager dir
    writeFileSync(join(rulesManagerDir, '01-coding-principles.md'), 'rule 1');
    writeFileSync(join(rulesManagerDir, '02-architecture.md'), 'rule 2');
    // Create known language rule
    mkdirSync(join(rulesManagerDir, 'languages'), { recursive: true });
    writeFileSync(join(rulesManagerDir, 'languages', 'typescript-coding-style.md'), 'ts rule');
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('getDeployedRules', () => {
    it('returns empty array when no rules are deployed', () => {
      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');
      expect(rules).toEqual([]);
    });

    it('detects deployed multi-file rules', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, '01-coding-principles.md'), 'rule content');
      writeFileSync(join(rulesDir, '02-architecture.md'), 'rule content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules).toHaveLength(2);
      expect(rules.map(r => r.name).sort()).toEqual([
        '01-coding-principles.md',
        '02-architecture.md',
      ]);
    });

    it('marks managed rules correctly', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, '01-coding-principles.md'), 'rule content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules[0].source).toBe('managed');
    });

    it('marks unknown rules correctly', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, 'custom-rule.md'), 'custom content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules[0].source).toBe('unknown');
    });

    it('detects symlinks', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      const sourcePath = join(rulesManagerDir, '01-coding-principles.md');
      const targetPath = join(rulesDir, '01-coding-principles.md');
      symlinkSync(sourcePath, targetPath);

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules[0].isSymlink).toBe(true);
    });

    it('detects non-symlink files', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, '01-coding-principles.md'), 'copied content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules[0].isSymlink).toBe(false);
    });

    it('detects single-file tool deployment', () => {
      writeFileSync(join(projectDir, 'AGENTS.md'), 'merged content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('codex');

      expect(rules).toHaveLength(1);
      expect(rules[0].name).toBe('AGENTS.md');
      expect(rules[0].source).toBe('managed');
    });

    it('handles .mdc extension for cursor', () => {
      const rulesDir = join(projectDir, '.cursor', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, '01-coding-principles.mdc'), 'rule content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('cursor');

      expect(rules).toHaveLength(1);
      expect(rules[0].name).toBe('01-coding-principles.mdc');
      expect(rules[0].source).toBe('managed');
    });

    it('detects language rules as managed', () => {
      const rulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(rulesDir, { recursive: true });
      writeFileSync(join(rulesDir, 'typescript-coding-style.md'), 'ts content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const rules = scanner.getDeployedRules('claude-code');

      expect(rules[0].source).toBe('managed');
    });
  });

  describe('getConfiguredTools', () => {
    it('returns empty array when no tools are configured', () => {
      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      expect(scanner.getConfiguredTools()).toEqual([]);
    });

    it('returns tools that have deployed rules', () => {
      const claudeRulesDir = join(projectDir, '.claude', 'rules');
      mkdirSync(claudeRulesDir, { recursive: true });
      writeFileSync(join(claudeRulesDir, '01-coding-principles.md'), 'content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const tools = scanner.getConfiguredTools();

      expect(tools).toContain('claude-code');
    });

    it('returns multiple configured tools', () => {
      // Claude Code
      const claudeDir = join(projectDir, '.claude', 'rules');
      mkdirSync(claudeDir, { recursive: true });
      writeFileSync(join(claudeDir, '01-coding-principles.md'), 'content');

      // Cline
      const clineDir = join(projectDir, '.clinerules');
      mkdirSync(clineDir, { recursive: true });
      writeFileSync(join(clineDir, '01-coding-principles.md'), 'content');

      const scanner = new DeploymentScanner(projectDir, rulesManagerDir);
      const tools = scanner.getConfiguredTools();

      expect(tools).toContain('claude-code');
      expect(tools).toContain('cline');
    });
  });
});
