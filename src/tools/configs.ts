import { ToolConfig } from '../types.js';
import { ToolName } from '../constants.js';

export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
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
