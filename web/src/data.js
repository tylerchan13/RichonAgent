import Papa from 'papaparse';
import originalCsv from '../public/sample_sales.csv?raw';
import { inferMapping, normalizeRows } from './analytics';

export function parseCSV(text) {
  const parsed = Papa.parse(text.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: header => header.trim() });
  if (parsed.errors.length) throw new Error(`CSV 格式有误：${parsed.errors[0].message}`);
  const columns = parsed.meta.fields ?? [];
  if (columns.some(column => !column) || new Set(columns.map(column => column.toLowerCase())).size !== columns.length || parsed.meta.renamedHeaders && Object.keys(parsed.meta.renamedHeaders).length) throw new Error('CSV 列名不能为空或重复，请先修改表头。');
  if (parsed.data.length > 50000) throw new Error('Demo 支持最多 50,000 行，请缩小数据范围后重试。');
  if (!columns.length || !parsed.data.length) throw new Error('文件中没有可分析的数据，请检查 CSV 内容。');
  return { raw: parsed.data, columns, mapping: inferMapping(columns) };
}

const sample = parseCSV(originalCsv);

export const SAMPLE = { id: 'sample', name: 'sample_sales.csv', label: '原项目销售样例', currency: 'HKD', rows: normalizeRows(sample.raw, sample.mapping).rows, note: '原项目示例 · HKD 为演示展示单位' };

function retailRows() {
  const products = ['皮具配饰', '精品腕表', '生活家居', '香氛护理', '数码配件'];
  const regions = ['中环', '尖沙咀', '铜锣湾', '线上商城'];
  const rows = [];
  for (let month = 1; month <= 6; month++) {
    for (let day = 1; day <= 28; day++) {
      const productIndex = (day + month) % 5;
      const revenue = Math.round(([1800, 4200, 1200, 780, 960][productIndex] * (1 + month * 0.075) + day * 23) / 10) * 10;
      rows.push({ date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, product: products[productIndex], region: regions[day % 4], revenue, units: 1 + day % 6, profit: Math.round(revenue * (0.18 + productIndex * 0.025)) });
    }
  }
  return rows;
}

export const RETAIL = { id: 'retail', name: 'hong_kong_retail.csv', label: '香港精品零售', currency: 'HKD', rows: retailRows(), note: '合成演示数据 · 非真实企业经营数据' };
export const BUILT_INS = [SAMPLE, RETAIL];

export function downloadText(text, filename, type = 'text/markdown;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
