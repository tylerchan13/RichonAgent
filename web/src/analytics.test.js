import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Papa from 'papaparse';
import { inferMapping, normalizeRows, summarize, growth, isoDate, numeric, createReport } from './analytics.js';

const parsed = Papa.parse(readFileSync(new URL('../public/sample_sales.csv', import.meta.url), 'utf8'), { header: true, skipEmptyLines: true });
const mapping = inferMapping(parsed.meta.fields);
const sampleRows = normalizeRows(parsed.data, mapping).rows;

test('original sample: deterministic KPIs and monthly totals', () => {
  const stats = summarize(sampleRows);
  assert.equal(stats.count, 36);
  assert.equal(stats.revenue, 21500);
  assert.equal(stats.profit, 4247.5);
  assert.equal(stats.margin.toFixed(2), '19.76');
  assert.equal(stats.units, 107);
  assert.deepEqual(stats.months.map(month => month.revenue), [7800, 6400, 7300]);
  assert.equal(stats.latestGrowth.toFixed(2), '14.06');
  assert.equal(stats.partialLastMonth, true);
  assert.equal(stats.products[0].name, 'Laptop');
  assert.equal(stats.products[0].value, 9600);
});

test('out-of-order dates and duplicate dates aggregate into calendar months', () => {
  const stats = summarize([...sampleRows].reverse());
  assert.deepEqual(stats.months.map(month => month.key), ['2024-01', '2024-02', '2024-03']);
  assert.equal(stats.start, '2024-01-02');
  assert.equal(stats.end, '2024-03-26');
  const rows = [{ ...sampleRows[0], revenue: 5 }, { ...sampleRows[0], revenue: 6 }];
  assert.equal(summarize(rows).months[0].revenue, 11);
});

test('zero or negative baseline and missing months do not fabricate growth', () => {
  assert.equal(growth(100, 0), null);
  assert.equal(growth(100, -50), null);
  assert.equal(summarize([sampleRows[0]]).latestGrowth, null);
  assert.equal(summarize([sampleRows[0], sampleRows.at(-1)]).latestGrowth, null);
});

test('missing optional fields remain unavailable, zero is a valid number', () => {
  const result = normalizeRows([{ 日期: '2024-02-29', 收入: '0' }], { date: '日期', revenue: '收入' });
  assert.deepEqual(result.errors, []);
  const stats = summarize(result.rows);
  assert.equal(stats.revenue, 0);
  assert.equal(stats.profit, null);
  assert.equal(stats.units, null);
  assert.equal(stats.margin, null);
  assert.equal(summarize([]).margin, null);
});

test('validation catches bad dates, missing values, invalid amounts and duplicate mappings', () => {
  assert.equal(isoDate('2024-02-30'), null);
  assert.equal(isoDate('2023-02-29'), null);
  assert.equal(isoDate('2024/2/29'), '2024-02-29');
  assert.equal(numeric('HK$1,200.50'), 1200.5);
  assert.equal(numeric('abc'), null);
  assert.equal(numeric(''), null);
  assert.equal(numeric('Infinity'), null);
  assert.equal(normalizeRows([{ date: '2024-01-01', sales: '' }], mapping).errors.length, 1);
  assert.equal(normalizeRows([{ date: '2024-01-01' }], { date: 'date', revenue: 'date' }).errors.length, 1);
  assert.equal(normalizeRows([], mapping).errors.length, 1);
});

test('filtered report uses the same totals, currency, scope, and calculation limits', () => {
  const rows = sampleRows.filter(row => row.region === 'North');
  const stats = summarize(rows);
  const report = createReport({ name: 'sample.csv', currency: 'HKD' }, stats, 'North');
  assert.match(report, /筛选范围：North/);
  assert.match(report, /HK\$5,000\.00/);
  assert.match(report, /未调用大模型/);
  assert.match(report, /不进行汇率转换/);
});
