import test from "node:test";
import assert from "node:assert/strict";
import { summarize, yen } from "./finance.mjs";
test("income and expenses are calculated separately", () => {
  assert.deepEqual(summarize([{balance:1000},{balance:2000}],[{amount:500},{amount:-120},{amount:-80}]), {balance:3000,income:500,expenses:200,net:300});
});
test("empty data results in zero", () => {
  assert.deepEqual(summarize([],[]), {balance:0,income:0,expenses:0,net:0});
});
test("reject unsafe and fractional monetary values", () => {
  assert.throws(() => summarize([{balance:1.5}],[]), TypeError);
  assert.throws(() => yen(Number.MAX_SAFE_INTEGER+1), TypeError);
});
