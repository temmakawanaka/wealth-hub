/** Amounts are in integer JPY. Pure functions; no persistence or network. */
export function summarize(accounts, transactions) {
  const balance = accounts.reduce((total, a) => total + requireAmount(a.balance), 0);
  const income = transactions.filter(t => t.amount > 0).reduce((total, t) => total + requireAmount(t.amount), 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((total, t) => total - requireAmount(t.amount), 0);
  return { balance, income, expenses, net: income - expenses };
}
export function requireAmount(amount) {
  if (!Number.isSafeInteger(amount)) throw new TypeError("Amount must be a safe integer (JPY)");
  return amount;
}
export function yen(amount) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(requireAmount(amount));
}
