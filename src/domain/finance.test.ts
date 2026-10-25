import { describe, expect, it } from 'vitest';
import { requireAmount, summarize, yen } from './finance';
import type { Account, Transaction } from './finance';

const account = (balance: number): Account => ({
  id: 'demo-account',
  name: 'Synthetic account',
  kind: 'cash',
  balance,
});
const transaction = (amount: number): Transaction => ({
  id: 'demo-transaction',
  name: 'Synthetic transaction',
  date: '2026-10-01',
  amount,
});
const invalidAmounts = [
  NaN,
  Infinity,
  -Infinity,
  0.5,
  -0.5,
  Number.MAX_SAFE_INTEGER + 1,
  Number.MIN_SAFE_INTEGER - 1,
];

describe('finance domain', () => {
  it('calculates income, spending and balance separately', () => {
    expect(
      summarize([account(1000), account(2000)], [transaction(500), transaction(-200)]),
    ).toEqual({ balance: 3000, income: 500, expenses: 200, net: 300 });
  });

  it('handles empty collections', () => {
    expect(summarize([], [])).toEqual({ balance: 0, income: 0, expenses: 0, net: 0 });
  });

  it.each(invalidAmounts)('rejects invalid amount %s without rounding', (amount) => {
    expect(() => requireAmount(amount)).toThrow(TypeError);
  });

  it.each(invalidAmounts)('rejects invalid balance %s', (amount) => {
    expect(() => summarize([account(amount)], [])).toThrow(TypeError);
  });

  it.each(invalidAmounts)('rejects invalid transaction %s before classification', (amount) => {
    expect(() => summarize([], [transaction(amount)])).toThrow(TypeError);
  });

  it.each(invalidAmounts)('refuses to format invalid amount %s', (amount) => {
    expect(() => yen(amount)).toThrow(TypeError);
  });

  it('rejects NaN even when valid transactions surround it', () => {
    expect(() => summarize([], [transaction(100), transaction(NaN), transaction(-50)])).toThrow(
      TypeError,
    );
  });

  it('allows zero transactions and normalizes negative zero', () => {
    expect(requireAmount(-0)).toBe(0);
    expect(yen(-0)).toBe(yen(0));
    expect(summarize([account(-0)], [transaction(0), transaction(-0)])).toEqual({
      balance: 0,
      income: 0,
      expenses: 0,
      net: 0,
    });
  });

  it('allows negative balances and a spending deficit', () => {
    expect(summarize([account(-200)], [transaction(100), transaction(-300)])).toEqual({
      balance: -200,
      income: 100,
      expenses: 300,
      net: -200,
    });
  });

  it.each([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])(
    'accepts the exact safe boundary %s',
    (amount) => {
      expect(requireAmount(amount)).toBe(amount);
      expect(summarize([account(amount)], []).balance).toBe(amount);
      expect(summarize([], [transaction(amount)]).net).toBe(amount);
    },
  );

  it.each([
    { name: 'positive overflow', amounts: [Number.MAX_SAFE_INTEGER, 1] },
    { name: 'negative overflow', amounts: [Number.MIN_SAFE_INTEGER, -1] },
    { name: 'positive overflow before cancellation', amounts: [Number.MAX_SAFE_INTEGER, 2, -2] },
    { name: 'negative overflow before cancellation', amounts: [Number.MIN_SAFE_INTEGER, -2, 2] },
  ])('rejects $name in balances', ({ amounts }) => {
    expect(() => summarize(amounts.map(account), [])).toThrow(TypeError);
  });

  it('rejects an unsafe income subtotal even if spending would offset it', () => {
    expect(() =>
      summarize([], [transaction(Number.MAX_SAFE_INTEGER), transaction(1), transaction(-1)]),
    ).toThrow(TypeError);
  });

  it('rejects an unsafe spending subtotal even if income would offset it', () => {
    expect(() =>
      summarize([], [transaction(Number.MIN_SAFE_INTEGER), transaction(-1), transaction(1)]),
    ).toThrow(TypeError);
  });

  it('does not mutate accounts or transactions', () => {
    const accounts = Object.freeze([Object.freeze(account(100))]);
    const transactions = Object.freeze([Object.freeze(transaction(-20))]);
    expect(summarize(accounts, transactions)).toEqual({
      balance: 100,
      income: 0,
      expenses: 20,
      net: -20,
    });
    expect(accounts[0]?.balance).toBe(100);
    expect(transactions[0]?.amount).toBe(-20);
  });

  it('formats whole yen without fractional digits', () => {
    const formatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
    expect(yen(1234)).toBe(formatter.format(1234));
  });
});
