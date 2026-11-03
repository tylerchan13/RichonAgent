export const CURRENCIES = { HKD: 'HK$', USD: 'US$', CNY: '¥' };

export function money(value, currency = 'HKD', digits = 0) {
  if (value === null || !Number.isFinite(value)) return '—';
  return `${CURRENCIES[currency] ?? currency}${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function numeric(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const cleaned = String(value).trim().replace(/^(HK\$|US\$|USD|HKD|CNY|RMB|¥|￥|\$)\s*/i, '').replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

export function isoDate(value) {
  const match = String(value ?? '').trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T].*)?$/);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const aliases = {
  date: ['date', 'orderdate', 'transactiondate', '日期', '交易日期', '订单日期'],
  revenue: ['sales', 'revenue', 'amount', '收入', '销售额', '营业额', '销售收入'],
  profit: ['profit', 'netprofit', 'grossprofit', '利润', '毛利', '净利润'],
  units: ['units', 'quantity', 'qty', '销量', '数量', '销售数量'],
  product: ['product', 'item', 'productname', '产品', '商品', '产品名称'],
  region: ['region', 'market', 'area', '地区', '区域', '市场'],
};

export function inferMapping(columns) {
  return Object.fromEntries(Object.entries(aliases).map(([key, names]) => [key, columns.find(column => names.includes(column.toLowerCase().replace(/[\s_-]/g, ''))) ?? '']));
}

export function normalizeRows(rawRows, mapping) {
  const errors = [];
  const rows = [];
  if (!mapping.date || !mapping.revenue) return { rows, errors: ['请选择日期和销售额字段。'] };
  if (new Set(Object.values(mapping).filter(Boolean)).size !== Object.values(mapping).filter(Boolean).length) return { rows, errors: ['每一列只能对应一种字段，请检查字段映射。'] };
  for (let index = 0; index < rawRows.length; index++) {
    const raw = rawRows[index];
    const date = isoDate(raw[mapping.date]);
    const revenue = numeric(raw[mapping.revenue]);
    const profit = mapping.profit ? numeric(raw[mapping.profit]) : null;
    const units = mapping.units ? numeric(raw[mapping.units]) : null;
    const invalid = !date ? '日期无效，请使用 YYYY-MM-DD' : revenue === null ? '销售额不是有效数字' : mapping.profit && profit === null ? '利润不是有效数字' : mapping.units && (units === null || units < 0) ? '数量必须是非负数字' : null;
    if (invalid) {
      errors.push(`第 ${index + 2} 行：${invalid}。`);
      continue;
    }
    rows.push({ date, revenue, profit, units, product: mapping.product ? String(raw[mapping.product] ?? '').trim() || '未分类' : '未分类', region: mapping.region ? String(raw[mapping.region] ?? '').trim() || '未分类' : '未分类' });
  }
  if (!rawRows.length) errors.push('CSV 没有数据行。');
  return { rows, errors };
}

export function growth(current, previous) {
  return previous > 0 ? (current - previous) / previous * 100 : null;
}

function ranked(rows, key) {
  const groups = new Map();
  for (const row of rows) groups.set(row[key], (groups.get(row[key]) ?? 0) + row.revenue);
  return [...groups].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function summarize(rows) {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const revenue = rows.reduce((total, row) => total + row.revenue, 0);
  const hasProfit = rows.length > 0 && rows.every(row => row.profit !== null);
  const hasUnits = rows.length > 0 && rows.every(row => row.units !== null);
  const profit = hasProfit ? rows.reduce((total, row) => total + row.profit, 0) : null;
  const units = hasUnits ? rows.reduce((total, row) => total + row.units, 0) : null;
  const monthMap = new Map();
  for (const row of sorted) {
    const key = row.date.slice(0, 7);
    const month = monthMap.get(key) ?? { key, revenue: 0, profit: hasProfit ? 0 : null };
    month.revenue += row.revenue;
    if (hasProfit) month.profit += row.profit;
    monthMap.set(key, month);
  }
  const months = [...monthMap.values()];
  const last = months.at(-1);
  const previous = months.at(-2);
  const consecutive = previous && new Date(`${last.key}-01T00:00:00Z`).getUTCFullYear() * 12 + new Date(`${last.key}-01T00:00:00Z`).getUTCMonth() - (new Date(`${previous.key}-01T00:00:00Z`).getUTCFullYear() * 12 + new Date(`${previous.key}-01T00:00:00Z`).getUTCMonth()) === 1;
  return { count: rows.length, revenue, profit, units, margin: revenue > 0 && hasProfit ? profit / revenue * 100 : null, months, latestGrowth: consecutive ? growth(last.revenue, previous.revenue) : null, products: ranked(rows, 'product'), regions: ranked(rows, 'region'), start: sorted[0]?.date, end: sorted.at(-1)?.date, hasProfit, hasUnits, partialLastMonth: sorted.length > 0 && Number(sorted.at(-1).date.slice(-2)) < new Date(Date.UTC(Number(last.key.slice(0, 4)), Number(last.key.slice(5, 7)), 0)).getUTCDate() };
}

export function observations(stats, currency) {
  if (!stats.count) return [];
  const last = stats.months.at(-1);
  const previous = stats.months.at(-2);
  const top = stats.products[0];
  const share = stats.revenue > 0 ? top.value / stats.revenue * 100 : null;
  const result = [];
  if (stats.latestGrowth !== null) {
    result.push({ title: `${Number(last.key.slice(5))} 月收入${stats.latestGrowth >= 0 ? '回升' : '下降'} ${Math.abs(stats.latestGrowth).toFixed(1)}%`, text: `由 ${Number(previous.key.slice(5))} 月的 ${money(previous.revenue, currency)} 变为 ${money(last.revenue, currency)}。${stats.partialLastMonth ? '末月数据可能不完整，比较前请确认覆盖周期。' : '建议结合促销与渠道变化进一步核实原因。'}` });
  } else {
    result.push({ title: `${stats.months.length} 个有记录月份，收入 ${money(stats.revenue, currency)}`, text: stats.months.length < 2 ? '当前仅有一个月份的数据，暂不计算月度增长率。' : '相邻月份缺失或基期不为正，暂不计算环比。缺失月份不自动计为零。' });
  }
  result.push({ title: top.name === '未分类' ? '补充产品字段，发现增长来源' : `${top.name} 贡献${share !== null ? ` ${share.toFixed(1)}% 收入` : '最高收入'}`, text: top.name === '未分类' ? '当前数据未提供可用产品分类。上传产品字段后可查看产品贡献排行。' : `累计销售额 ${money(top.value, currency)}，在当前数据中排名第一。可优先检查库存与销售资源配置。` });
  result.push(stats.hasProfit ? { title: stats.margin !== null ? `整体利润率为 ${stats.margin.toFixed(2)}%` : '收入非正，利润率暂不可计算', text: `利润合计 ${money(stats.profit, currency, 2)}。口径取自上传的利润字段；此处不推定其为毛利或净利润。` } : { title: '补充利润，完善经营视角', text: '当前文件没有映射利润字段，因此未推算利润或利润率。可在上传时补充此字段。' });
  return result;
}

export function createReport(dataset, stats, region = '全部地区') {
  const insights = observations(stats, dataset.currency);
  const lines = [ '# Richon Agent · 经营分析报告', '', `数据集：${dataset.name}`, `筛选范围：${region}`, `数据区间：${stats.start ?? '—'} 至 ${stats.end ?? '—'}`, `记录数：${stats.count}`, `展示币种：${dataset.currency}（按原始金额展示，不进行汇率转换）`, '', '## 核心指标', '', '| 指标 | 数值 |', '| --- | ---: |', `| 销售收入 | ${money(stats.revenue, dataset.currency, 2)} |`, `| 利润 | ${money(stats.profit, dataset.currency, 2)} |`, `| 利润率 | ${stats.margin === null ? '未提供 / 不适用' : stats.margin.toFixed(2) + '%'} |`, `| 销售数量 | ${stats.units ?? '未提供'} |`, '', '## 月度趋势', '', '| 月份 | 收入 | 利润 |', '| --- | ---: | ---: |', ...stats.months.map(month => `| ${month.key} | ${money(month.revenue, dataset.currency, 2)} | ${money(month.profit, dataset.currency, 2)} |`), '', '## 关键观察与建议', '', ...insights.map((insight, index) => `${index + 1}. **${insight.title}**\n   ${insight.text}`), '', '## 产品贡献', '', '| 产品 | 收入 |', '| --- | ---: |', ...stats.products.slice(0, 5).map(item => `| ${item.name.replaceAll('|', '／')} | ${money(item.value, dataset.currency, 2)} |`), '', '## 计算口径与限制', '', '- 指标由浏览器本地代码计算；观察与建议来自明确规则，未调用大模型。', '- 收入 = 销售额字段求和；利润 = 利润字段求和；利润率 = 利润合计 ÷ 收入合计。', '- 数量为上传数量字段的合计，不代表订单数，也不推算客单价。', '- 趋势按自然月汇总，环比仅比较连续且基期收入为正的月份；缺失月份不补零。', '- 不推定币种或利润的会计定义，不进行汇率转换、因果推断或季节性预测。', '- 数据覆盖区间不代表完整营业周期；末月可能未结束，比较时应使用同口径期间。', '- 上传数据只保存在当前页面内存中，刷新后清除。', '' ];
  return lines.join('\n');
}
