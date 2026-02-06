import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { executeSetup } from './setup.js';

describe('setup command', () => {
  const testDir = join(tmpdir(), 'rulesmgr-setup-test-' + Date.now());

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('creates rules directory with templates', async () => {
    await executeSetup(testDir);

    expect(existsSync(join(testDir, '01-tech-stack.md'))).toBe(true);
    expect(existsSync(join(testDir, '02-coding-principles.md'))).toBe(true);
    expect(existsSync(join(testDir, 'languages/typescript-coding-style.md'))).toBe(true);
  });

  it('does not overwrite existing files', async () => {
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, '01-tech-stack.md'), 'custom content');

    await executeSetup(testDir);

    const content = readFileSync(join(testDir, '01-tech-stack.md'), 'utf-8');
    expect(content).toBe('custom content');
  });

  it('creates all template files', async () => {
    await executeSetup(testDir);

    // Check all root templates
    expect(existsSync(join(testDir, '01-tech-stack.md'))).toBe(true);
    expect(existsSync(join(testDir, '02-coding-principles.md'))).toBe(true);
    expect(existsSync(join(testDir, '03-architecture.md'))).toBe(true);
    expect(existsSync(join(testDir, '04-testing.md'))).toBe(true);
    expect(existsSync(join(testDir, '05-git-commit.md'))).toBe(true);
    expect(existsSync(join(testDir, '06-code-review.md'))).toBe(true);

    // Check language templates
    expect(existsSync(join(testDir, 'languages/typescript-coding-style.md'))).toBe(true);
    expect(existsSync(join(testDir, 'languages/python-coding-style.md'))).toBe(true);
  });

  it('creates languages subdirectory', async () => {
    await executeSetup(testDir);

    expect(existsSync(join(testDir, 'languages'))).toBe(true);
  });

  it('creates agent settings directories', async () => {
    await executeSetup(testDir);

    // Claude settings directory should be created
    expect(existsSync(join(testDir, 'claude'))).toBe(true);
    expect(existsSync(join(testDir, 'claude', 'settings.local.json'))).toBe(true);
  });

  it('does not overwrite existing agent settings', async () => {
    mkdirSync(join(testDir, 'claude'), { recursive: true });
    writeFileSync(join(testDir, 'claude', 'settings.local.json'), '{"custom": true}');

    await executeSetup(testDir);

    const content = readFileSync(join(testDir, 'claude', 'settings.local.json'), 'utf-8');
    expect(content).toBe('{"custom": true}');
  });
});
