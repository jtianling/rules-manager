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
