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
};

export const DEFAULT_LANGUAGES = [
  'typescript',
  'python',
  'go',
  'rust',
] as const;
