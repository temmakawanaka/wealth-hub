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
/** Whole-yen values only. Do not use floating-point fractions for money. */
export function requireAmount(amount: number): number {
  if (!Number.isSafeInteger(amount)) throw new TypeError('Amount must be a safe integer (JPY)');
  return amount;
}
export function summarize(
  accounts: readonly Account[],
  transactions: readonly Transaction[],
): Summary {
  const balance = accounts.reduce((sum, account) => sum + requireAmount(account.balance), 0);
  const income = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + requireAmount(tx.amount), 0);
  const expenses = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum - requireAmount(tx.amount), 0);
  return {
    balance: requireAmount(balance),
    income: requireAmount(income),
    expenses: requireAmount(expenses),
    net: requireAmount(income - expenses),
  };
}
export function yen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(requireAmount(amount));
}
