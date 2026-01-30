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

    it('returns empty array when no rules exist', () => {
      const rules = service.getAvailableRules();
      expect(rules).toEqual([]);
    });

    it('assigns priority 99 to files without numeric prefix', () => {
      writeFileSync(join(testDir, 'no-priority.md'), 'content');
      const rules = service.getAvailableRules();
      expect(rules[0].priority).toBe(99);
    });

    it('includes file content', () => {
      writeFileSync(join(testDir, '01-test.md'), 'test content here');
      const rules = service.getAvailableRules();
      expect(rules[0].content).toBe('test content here');
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

    it('returns empty array when no languages exist', () => {
      const langs = service.getAvailableLanguages();
      expect(langs).toEqual([]);
    });

    it('only includes files with -coding-style.md suffix', () => {
      writeFileSync(join(testDir, 'languages/typescript-coding-style.md'), 'ts');
      writeFileSync(join(testDir, 'languages/readme.md'), 'readme');
      const langs = service.getAvailableLanguages();
      expect(langs).toEqual(['typescript']);
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

    it('returns correct rule metadata', () => {
      writeFileSync(join(testDir, 'languages/python-coding-style.md'), 'py content');
      const rule = service.getLanguageRule('python');
      expect(rule?.name).toBe('python-coding-style.md');
      expect(rule?.priority).toBe(2.5);
    });
  });

  describe('getRuleByName', () => {
    it('finds rule by exact name', () => {
      writeFileSync(join(testDir, '01-coding-principles.md'), 'principles');
      const rule = service.getRuleByName('01-coding-principles.md');
      expect(rule?.content).toBe('principles');
    });

    it('finds rule by name without extension', () => {
      writeFileSync(join(testDir, '01-coding-principles.md'), 'principles');
      const rule = service.getRuleByName('01-coding-principles');
      expect(rule?.content).toBe('principles');
    });

    it('returns undefined for non-existent rule', () => {
      const rule = service.getRuleByName('nonexistent');
      expect(rule).toBeUndefined();
    });
  });
});
