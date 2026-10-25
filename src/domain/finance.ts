export interface Account {
  id: string;
  name: string;
  kind: string;
  balance: number;
}
export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
}
export interface Summary {
  balance: number;
  income: number;
  expenses: number;
  net: number;
}
/** Whole-yen values only; reject invalid input without coercion or rounding. */
export function requireAmount(amount: number): number {
  if (!Number.isSafeInteger(amount)) throw new TypeError('Amount must be a safe integer (JPY)');
  return amount === 0 ? 0 : amount;
}
/**
 * Validate before classification, including zero and NaN.
 * Reject an unsafe intermediate sum even if later amounts would cancel it.
 * Negative balances are allowed; income/expenses are nonnegative magnitudes.
 */
export function summarize(
  accounts: readonly Account[],
  transactions: readonly Transaction[],
): Summary {
  let balance = 0;
  let income = 0;
  let expenses = 0;
  for (const account of accounts) {
    balance = requireAmount(balance + requireAmount(account.balance));
  }
  for (const transaction of transactions) {
    const amount = requireAmount(transaction.amount);
    if (amount > 0) income = requireAmount(income + amount);
    else if (amount < 0) expenses = requireAmount(expenses - amount);
  }
  return { balance, income, expenses, net: requireAmount(income - expenses) };
}
export function yen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(requireAmount(amount));
}
