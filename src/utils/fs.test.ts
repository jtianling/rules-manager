import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { ensureDir, copyFile, linkFile, isSymlink, readFileContent, getFilesInDir } from './fs.js';

describe('fs utilities', () => {
  const testDir = join(tmpdir(), 'rulesmgr-test-' + Date.now());

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('ensureDir', () => {
    it('creates directory if not exists', () => {
      const dir = join(testDir, 'new-dir');
      ensureDir(dir);
      expect(existsSync(dir)).toBe(true);
    });

    it('does nothing if directory exists', () => {
      const dir = join(testDir, 'existing-dir');
      mkdirSync(dir);
      expect(() => ensureDir(dir)).not.toThrow();
    });
  });

  describe('copyFile', () => {
    it('copies file content', () => {
      const src = join(testDir, 'source.txt');
      const dest = join(testDir, 'dest.txt');
      writeFileSync(src, 'hello');
      copyFile(src, dest);
      expect(readFileContent(dest)).toBe('hello');
    });
  });

  describe('linkFile', () => {
    it('creates symlink', () => {
      const src = join(testDir, 'source.txt');
      const dest = join(testDir, 'link.txt');
      writeFileSync(src, 'hello');
      linkFile(src, dest);
      expect(isSymlink(dest)).toBe(true);
      expect(readFileContent(dest)).toBe('hello');
    });
  });

  describe('getFilesInDir', () => {
    it('returns files sorted by name', () => {
      writeFileSync(join(testDir, '02-second.md'), '');
      writeFileSync(join(testDir, '01-first.md'), '');
      const files = getFilesInDir(testDir);
      expect(files.map(f => f.name)).toEqual(['01-first.md', '02-second.md']);
    });
  });
});
