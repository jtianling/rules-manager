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
