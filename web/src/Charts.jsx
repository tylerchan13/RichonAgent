import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { money, observations } from './analytics';

export function RevenueChart({ stats, currency }) {
  const [metric, setMetric] = useState('revenue');
  const [hovered, setHovered] = useState(null);
  const active = metric === 'profit' && stats.hasProfit ? 'profit' : 'revenue';
  const points = stats.months;
  const values = points.map(point => point[active]);
  const low = Math.min(...values, 0);
  const high = Math.max(...values, 1);
  const step = Math.max(1, 10 ** Math.floor(Math.log10((high - low) / 4)));
  const minimum = Math.floor(low / step) * step;
  const maximum = Math.ceil(high * 1.16 / step) * step;
  const y = value => 207 - (value - minimum) / (maximum - minimum) * 164;
  const x = index => points.length === 1 ? 426 : 92 + index * 668 / (points.length - 1);
  const path = values.map((value, index) => index === 0 ? `M ${x(index)} ${y(value)}` : `C ${(x(index - 1) + x(index)) / 2} ${y(values[index - 1])}, ${(x(index - 1) + x(index)) / 2} ${y(value)}, ${x(index)} ${y(value)}`).join(' ');
  const area = values.length > 1 ? `${path} L ${x(values.length - 1)} ${y(minimum)} L ${x(0)} ${y(minimum)} Z` : '';
  const current = hovered !== null ? points[hovered] : null;
  return <section className="panel trend-panel" aria-label="月度收入与利润趋势">
    <div className="panel-heading"><div><h2>经营趋势</h2><span className="panel-caption">按自然月汇总 · {currency}</span></div><div className="segmented" aria-label="趋势指标"><button aria-pressed={active === 'revenue'} onClick={() => { setMetric('revenue'); setHovered(null); }}>收入</button><button aria-pressed={active === 'profit'} disabled={!stats.hasProfit} title={!stats.hasProfit ? '上传利润字段后可查看' : undefined} onClick={() => { setMetric('profit'); setHovered(null); }}>利润</button></div></div>
    <div className="chart-canvas">
      <svg viewBox="0 0 800 250" role="img" aria-label={`${active === 'revenue' ? '收入' : '利润'}月度趋势：${points.map(point => `${point.key} ${money(point[active], currency)}`).join('，')}`}>
        <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#212329" stopOpacity="0.10"/><stop offset="100%" stopColor="#212329" stopOpacity="0.005"/></linearGradient></defs>
        {[0, 1, 2, 3, 4].map(index => { const value = minimum + (maximum - minimum) * index / 4; return <g key={index}><line x1="74" x2="782" y1={y(value)} y2={y(value)} stroke="#e7e8eb" strokeDasharray={index ? '3 5' : undefined}/><text x="60" y={y(value) + 4} textAnchor="end" className="axis-label">{Math.abs(value) >= 10000 ? `${(value / 1000).toFixed(0)}k` : Math.round(value).toLocaleString('en-US')}</text></g>; })}
        {area && <path d={area} fill="url(#chart-fill)"/>}
        <path d={path} fill="none" stroke="#25272c" strokeWidth="2.5"/>
        {points.map((point, index) => <g key={point.key}>
          {points.length <= 8 && <text x={x(index)} y={y(point[active]) - 16} textAnchor="middle" className="point-label">{Math.round(point[active]).toLocaleString('en-US')}</text>}
          {(points.length <= 12 || index % Math.ceil(points.length / 6) === 0 || index === points.length - 1) && <text x={x(index)} y="237" textAnchor="middle" className="axis-label">{points.length > 12 ? point.key : `${Number(point.key.slice(5))} 月`}</text>}
          <circle cx={x(index)} cy={y(point[active])} r="4.5" fill="#fff" stroke="#25272c" strokeWidth="2"/>
          <circle tabIndex="0" role="button" aria-label={`${point.key} ${money(point[active], currency, 2)}`} cx={x(index)} cy={y(point[active])} r="14" fill="transparent" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}/>
        </g>)}
      </svg>
      {current && <div className="chart-tooltip" role="status">{current.key}<strong>{money(current[active], currency, 2)}</strong></div>}
    </div>
    <div className="chart-footer"><span><i className="legend-dot"/>{active === 'revenue' ? '销售收入' : '利润'}</span><span>{stats.start?.slice(0, 4)} 年 · {points.length} 个有记录月份</span></div>
  </section>;
}

export function InsightPanel({ stats, currency, onReport }) {
  return <aside className="insight-panel"><div className="panel-heading"><h2>关键观察</h2><span className="tiny-label">INSIGHTS</span></div><div className="insights-list">{observations(stats, currency).map((insight, index) => <article className="insight" key={index}><span className="insight-index">0{index + 1}</span><div><h3>{insight.title}</h3><p>{insight.text}</p></div></article>)}</div><button className="text-link insight-link" onClick={onReport}>查看完整分析报告<ArrowUpRight size={15}/></button><p className="calculation-note"><Info size={12}/>规则计算洞察 · 未连接 AI 模型</p></aside>;
}

export function ProductChart({ stats, currency }) {
  const products = stats.products.slice(0, 5);
  const largest = Math.max(...products.map(product => Math.abs(product.value)), 1);
  return <section className="panel products-panel"><div className="panel-heading"><h2>产品贡献</h2><span className="panel-caption">按销售收入 · TOP {products.length}</span></div><div className="product-bars">{products.map((product, index) => <div className="product-row" key={product.name}><span className="product-name" title={product.name}>{product.name}</span><div className="bar-track"><span style={{ width: `${Math.abs(product.value) / largest * 100}%`, opacity: 1 - index * 0.14 }}/></div><strong>{money(product.value, currency)}</strong></div>)}</div></section>;
}

export function RegionTable({ stats, currency }) {
  return <section className="panel regions-panel"><div className="panel-heading"><h2>地区表现</h2><span className="panel-caption">收入占比</span></div><div className="region-table"><div className="region-table-head"><span>地区</span><span>销售收入</span><span>占比</span><span/></div>{stats.regions.slice(0, 5).map(region => { const share = stats.revenue > 0 ? region.value / stats.revenue * 100 : null; return <div className="region-row" key={region.name}><span title={region.name}>{region.name}</span><strong>{money(region.value, currency)}</strong><span>{share === null ? '—' : `${share.toFixed(1)}%`}</span><div className="mini-track"><span style={{ width: `${Math.min(100, Math.max(0, share ?? 0))}%` }}/></div></div>; })}<div className="region-total"><span>{stats.regions.length > 5 ? '全部地区合计' : '合计'}</span><strong>{money(stats.revenue, currency)}</strong><span>{stats.revenue > 0 ? '100%' : '—'}</span><span/></div></div></section>;
}

export function Kpis({ stats, currency }) {
  const GrowthIcon = stats.latestGrowth >= 0 ? ArrowUpRight : ArrowDownRight;
  return <div className="kpi-grid" aria-label="经营关键指标">
    <div className="kpi"><span className="kpi-label">销售收入 <span>REVENUE</span></span><strong data-testid="revenue">{money(stats.revenue, currency)}</strong><span className="kpi-detail">{stats.latestGrowth !== null ? <><GrowthIcon size={13}/>{Math.abs(stats.latestGrowth).toFixed(1)}% {stats.latestGrowth >= 0 ? '较上月增长' : '较上月下降'}{stats.partialLastMonth ? ' · 末月可能不完整' : ''}</> : '当前筛选范围内的销售额合计'}</span></div>
    <div className="kpi"><span className="kpi-label">利润合计 <span>PROFIT</span></span><strong data-testid="profit">{money(stats.profit, currency, 2)}</strong><span className="kpi-detail">{stats.hasProfit ? '按数据中的利润字段计算' : '未映射利润字段'}</span></div>
    <div className="kpi"><span className="kpi-label">利润率 <span>MARGIN</span></span><strong data-testid="margin">{stats.margin === null ? '—' : <>{stats.margin.toFixed(2)}<span className="metric-suffix">%</span></>}</strong><span className="kpi-detail">利润合计 / 销售收入</span></div>
    <div className="kpi"><span className="kpi-label">销售数量 <span>UNITS SOLD</span></span><strong data-testid="units">{stats.units === null ? '—' : stats.units.toLocaleString('en-US')}</strong><span className="kpi-detail">{stats.count.toLocaleString('en-US')} 笔数据记录 · 不等同于订单数</span></div>
  </div>;
}
