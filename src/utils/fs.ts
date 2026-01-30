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
