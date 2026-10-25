import type { Account, Transaction } from './domain/finance';

// Fictional sample data: NEVER put real financial information in source control.
export const accounts: readonly Account[] = [
  { id: 'daily', name: '生活費口座（サンプル）', kind: '普通預金', balance: 420000 },
  { id: 'saving', name: '貯蓄口座（サンプル）', kind: '普通預金', balance: 820000 },
  { id: 'invest', name: '投資口座（サンプル）', kind: '証券', balance: 1450000 },
];
export const transactions: readonly Transaction[] = [
  { id: '1', date: '10/24', name: '食料品（サンプル）', amount: -4800 },
  { id: '2', date: '10/22', name: '給与（サンプル）', amount: 290000 },
  { id: '3', date: '10/21', name: '光熱費（サンプル）', amount: -11200 },
  { id: '4', date: '10/20', name: '日用品（サンプル）', amount: -3500 },
];
