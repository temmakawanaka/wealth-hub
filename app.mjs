import {summarize, yen} from "./finance.mjs";
// Fictional demo data only. Never replace with personal bank or financial details.
const accounts = [
  {name:"生活費口座（サンプル）",kind:"普通預金",balance:420000},
  {name:"貯蓄口座（サンプル）",kind:"普通預金",balance:820000},
  {name:"投資口座（サンプル）",kind:"証券",balance:1450000}
];
const transactions = [
  {date:"10/24",name:"食料品（サンプル）",amount:-4800},
  {date:"10/22",name:"給与（サンプル）",amount:290000},
  {date:"10/21",name:"光熱費（サンプル）",amount:-11200},
  {date:"10/20",name:"日用品（サンプル）",amount:-3500}
];
const totals=summarize(accounts,transactions);
for (const key of ["balance","income","expenses","net"]) {
  document.getElementById(key).textContent=yen(totals[key]);
}
function el(tag, className, text) {
  const node=document.createElement(tag);
  if(className) node.className=className;
  node.textContent=text;
  return node;
}
for(const account of accounts) {
  const li=el("li","list-row");
  const left=el("div","");
  left.append(el("strong","",account.name),el("small","",account.kind));
  li.append(left,el("b","",yen(account.balance)));
  document.getElementById("accounts").append(li);
}
for(const tx of transactions) {
  const li=el("li","list-row");
  const left=el("div","");
  left.append(el("strong","",tx.name),el("small","",tx.date));
  li.append(left,el("b",tx.amount<0?"negative":"positive", (tx.amount>0?"+":"")+yen(tx.amount)));
  document.getElementById("transactions").append(li);
}
