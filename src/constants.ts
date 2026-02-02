import { homedir } from 'os';
import { join } from 'path';

export const RULES_MANAGER_DIR = join(homedir(), '.rules-manager');
export const LANGUAGES_DIR = 'languages';

export const SUPPORTED_TOOLS = [
  // Preferred tools first
  'antigravity',
  'roo-code',
  'claude-code',
  'opencode',
  // Rest alphabetically
  'cline',
  'cursor',
  'goose',
  'kilo-code',
  'trae',
  'windsurf',
] as const;

export type ToolName = typeof SUPPORTED_TOOLS[number];

export const TOOL_DISPLAY_NAMES: Record<ToolName, string> = {
  'claude-code': 'Claude Code',
  'cursor': 'Cursor',
  'cline': 'Cline',
  'roo-code': 'Roo Code',
  'kilo-code': 'Kilo Code',
  'windsurf': 'Windsurf',
  'opencode': 'OpenCode',
  'trae': 'TRAE',
  'goose': 'Goose',
  'antigravity': 'Antigravity',
};

export const DEFAULT_LANGUAGES = [
  'typescript',
  'python',
  'go',
  'rust',
] as const;
