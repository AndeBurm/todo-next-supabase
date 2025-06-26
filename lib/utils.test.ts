import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('объединяет строки классов', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('игнорирует undefined/null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
  it('мерджит tailwind-классы', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
}); 