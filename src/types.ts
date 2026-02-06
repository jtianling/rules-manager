export { ToolName } from './constants.js';

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
  gitignore?: boolean;
}

export interface ToolConfig {
  name: ToolName;
  displayName: string;
  targetPath: string;
  supportsMultiFile: boolean;
  supportsLink: boolean;
  charLimit?: number;
  fileExtension: string;
  /** Directory name under ~/.rules-manager/ for tool-specific settings */
  settingsDir?: string;
  /** Directory in the project where settings files should be copied to */
  settingsTargetPath?: string;
}
