import { describe, expect, it } from 'vitest';
import { requireAmount, summarize, yen } from './finance';

describe('finance domain', () => {
  it('calculates income, spending and balance separately', () => {
    expect(
      summarize(
        [{ id: 'a', name: 'Demo', kind: 'cash', balance: 3000 }],
        [
          { id: '1', name: 'Income', date: '2026-10-01', amount: 500 },
          { id: '2', name: 'Expense', date: '2026-10-02', amount: -200 },
        ],
      ),
    ).toEqual({ balance: 3000, income: 500, expenses: 200, net: 300 });
  });
  it('handles empty collections', () => {
    expect(summarize([], [])).toEqual({ balance: 0, income: 0, expenses: 0, net: 0 });
  });
  it('rejects fractional and unsafe monetary values', () => {
    expect(() => requireAmount(1.5)).toThrow(TypeError);
    expect(() => yen(Number.MAX_SAFE_INTEGER + 1)).toThrow(TypeError);
  });
});
