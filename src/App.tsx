import { summarize, yen } from './domain/finance';
import { accounts, transactions } from './demo';

const summary = summarize(accounts, transactions);
const metrics = [
  { title: '総残高（デモ）', value: summary.balance, hint: 'すべての登録口座の合計' },
  { title: '今月の収入（デモ）', value: summary.income, hint: '入金取引の合計' },
  { title: '今月の支出（デモ）', value: summary.expenses, hint: '出金取引の合計' },
  { title: '今月の収支（デモ）', value: summary.net, hint: '収入 − 支出' },
];

export function App() {
  return (
    <>
      <header className="header">
        <div className="brand"><span className="mark">W</span><span>wealth-hub</span></div>
        <span className="demo">DEMO · 架空データ</span>
      </header>
      <main>
        <div className="intro">
          <div>
            <p className="eyebrow">PERSONAL FINANCE</p>
            <h1>家計と資産を、ひとつの画面に。</h1>
            <p className="muted">銀行・カード・資産情報を一元管理するためのプロトタイプ</p>
          </div>
          <span className="tag">外部サービス未接続</span>
        </div>
        <section aria-label="サマリー" className="cards">
          {metrics.map((metric) => (
            <article className="card" key={metric.title}>
              <h2>{metric.title}</h2>
              <p className="figure">{yen(metric.value)}</p>
              <p className="hint">{metric.hint}</p>
            </article>
          ))}
        </section>
        <div className="columns">
          <section className="panel">
            <div className="panel-head"><h2>口座一覧</h2><span>サンプル</span></div>
            <ul className="account-list">
              {accounts.map((account) => (
                <li className="list-row" key={account.id}>
                  <div><strong>{account.name}</strong><small>{account.kind}</small></div>
                  <b>{yen(account.balance)}</b>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>最近の取引</h2><span>サンプル</span></div>
            <ul className="transaction-list">
              {transactions.map((tx) => (
                <li className="list-row" key={tx.id}>
                  <div><strong>{tx.name}</strong><small>{tx.date}</small></div>
                  <b className={tx.amount < 0 ? 'negative' : 'positive'}>
                    {tx.amount > 0 ? '+' : ''}{yen(tx.amount)}
                  </b>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <p className="notice">
          🔒 この画面はデモ専用です。個人情報の入力・保存・外部送信は行いません。
          実データ連携は認証・認可APIを実装してから有効にします。
        </p>
      </main>
    </>
  );
}
