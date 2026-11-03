import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Database } from 'lucide-react';
import { money } from './analytics';

export default function DataView({ rows, currency, name }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const matching = useMemo(() => rows.filter(row => `${row.date} ${row.product} ${row.region}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const pages = Math.max(1, Math.ceil(matching.length / 10));
  const activePage = Math.min(page, pages - 1);
  return <section className="panel data-panel"><div className="panel-heading"><div><h2>数据明细</h2><span className="panel-caption">{name} · 已标准化日期与字段</span></div><label className="search-field"><Search size={15}/><input aria-label="搜索数据" placeholder="搜索产品、地区或日期" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }}/></label></div><div className="table-scroll"><table className="data-table"><thead><tr><th>日期</th><th>产品</th><th>地区</th><th>销售收入</th><th>利润</th><th>数量</th></tr></thead><tbody>{matching.slice(activePage * 10, (activePage + 1) * 10).map((row, index) => <tr key={`${activePage}-${index}`}><td>{row.date}</td><td>{row.product}</td><td>{row.region}</td><td>{money(row.revenue, currency, 2)}</td><td>{money(row.profit, currency, 2)}</td><td>{row.units ?? '—'}</td></tr>)}</tbody></table></div>{!matching.length && <div className="empty-state"><Database size={26}/><h3>没有找到匹配记录</h3><p>试试其他产品名称、地区或日期。</p><button className="text-link" onClick={() => setSearch('')}>清除搜索</button></div>}<div className="table-footer"><span>{matching.length ? `${activePage * 10 + 1}–${Math.min((activePage + 1) * 10, matching.length)}` : '0'} / {matching.length.toLocaleString('en-US')} 条记录</span><div><button className="icon-button" aria-label="上一页" disabled={activePage === 0} onClick={() => setPage(activePage - 1)}><ChevronLeft size={16}/></button><span>{activePage + 1} / {pages}</span><button className="icon-button" aria-label="下一页" disabled={activePage >= pages - 1} onClick={() => setPage(activePage + 1)}><ChevronRight size={16}/></button></div></div></section>;
}
