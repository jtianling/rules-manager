import { readFileSync } from 'fs';

export function filesAreDifferent(path1: string, path2: string): boolean {
  try {
    const content1 = readFileSync(path1, 'utf-8');
    const content2 = readFileSync(path2, 'utf-8');
    return content1 !== content2;
  } catch {
    return true;
  }
}

export function showDiff(localPath: string, sourcePath: string): void {
  const local = readFileSync(localPath, 'utf-8');
  const source = readFileSync(sourcePath, 'utf-8');

  console.log('\n--- Local (current) ---');
  console.log(local.slice(0, 500) + (local.length > 500 ? '\n...(truncated)' : ''));
  console.log('\n--- Source (new) ---');
  console.log(source.slice(0, 500) + (source.length > 500 ? '\n...(truncated)' : ''));
  console.log('');
}
