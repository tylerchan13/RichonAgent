import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownToLine, Upload, FileSpreadsheet, ChevronDown, Check, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { summarize, createReport } from './analytics';
import { BUILT_INS, SAMPLE, downloadText } from './data';
import { Kpis, RevenueChart, InsightPanel, ProductChart, RegionTable } from './Charts';
import UploadDialog from './UploadDialog';
import DataView from './DataView';
import ReportView from './ReportView';

const NAV = [{ id: 'overview', label: '业务总览' }, { id: 'dataset', label: '数据集' }, { id: 'report', label: '分析报告' }];
const TITLES = { overview: ['Business, clarified.', '看清业务表现，笃定下一步。'], dataset: ['Details that matter.', '每一个判断，都从真实的数据开始。'], report: ['From insight to action.', '让业务洞察，成为清晰的行动。'] };

function Wordmark() { return <a href="#overview" className="wordmark" aria-label="Richon Agent 首页"><svg viewBox="0 0 32 34" aria-hidden="true"><path d="M5 30V4h11a8.3 8.3 0 0 1 0 16h-4m4 0 12 10" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M5 4 17 14" stroke="#b69b77" strokeWidth="2"/></svg><span>Richon <strong>Agent</strong><span className="wordmark-period">.</span></span></a>; }

export default function App() {
  const [tab, setTab] = useState(() => NAV.some(item => `#${item.id}` === window.location.hash) ? window.location.hash.slice(1) : 'overview');
  const [dataset, setDataset] = useState(SAMPLE);
  const [uploaded, setUploaded] = useState(null);
  const [region, setRegion] = useState('全部地区');
  const [showUpload, setShowUpload] = useState(false);
  const [showDatasets, setShowDatasets] = useState(false);
  const [toast, setToast] = useState('');
  const datasetPicker = useRef(null);
  const datasets = uploaded ? [...BUILT_INS, uploaded] : BUILT_INS;
  const regions = useMemo(() => [...new Set(dataset.rows.map(row => row.region))].sort(), [dataset]);
  const dateRange = useMemo(() => dataset.rows.reduce((range, row) => [row.date < range[0] ? row.date : range[0], row.date > range[1] ? row.date : range[1]], [dataset.rows[0].date, dataset.rows[0].date]), [dataset]);
  const rows = useMemo(() => region === '全部地区' ? dataset.rows : dataset.rows.filter(row => row.region === region), [dataset, region]);
  const stats = useMemo(() => summarize(rows), [rows]);

  useEffect(() => { const listener = () => { const hash = window.location.hash.slice(1); if (NAV.some(item => item.id === hash)) setTab(hash); }; window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener); }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 4200); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!showDatasets) return; const outside = event => { if (!datasetPicker.current?.contains(event.target)) setShowDatasets(false); }; const escape = event => { if (event.key === 'Escape') setShowDatasets(false); }; document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); }; }, [showDatasets]);

  function goTo(next) { setTab(next); window.location.hash = next; }
  function chooseDataset(next) { setDataset(next); setRegion('全部地区'); setShowDatasets(false); setToast(`已载入 ${next.label}，指标已重新计算。`); }
  function imported(next) { setUploaded(next); chooseDataset(next); setShowUpload(false); goTo('overview'); }
  function exportReport() { downloadText(createReport(dataset, stats, region), `${dataset.name.replace(/\.csv$/i, '')}-report.md`); setToast('分析报告已下载，包含当前筛选范围与计算口径。'); }

  return <><header className="site-header"><div className="header-inner"><Wordmark/><nav aria-label="主导航">{NAV.map(item => <a href={`#${item.id}`} key={item.id} aria-current={tab === item.id ? 'page' : undefined} onClick={() => goTo(item.id)}>{item.label}</a>)}</nav><div className="workspace-label"><span>Demo workspace</span><span className="avatar">RA</span></div></div></header>
    <main className="main-content"><section className="page-heading"><div><h1>{TITLES[tab][0]}</h1><p>{TITLES[tab][1]}</p></div><div className="heading-actions"><button className="button button-outline" onClick={() => setShowUpload(true)}><Upload size={15}/>导入 CSV</button><button className="button button-dark" onClick={exportReport}><ArrowDownToLine size={15}/>导出报告</button></div></section>
      <section className="dataset-strip" aria-label="当前数据集"><div className="dataset-identity"><FileSpreadsheet size={21} strokeWidth={1.4}/><strong title={dataset.name}>{dataset.name}</strong><span className="dataset-meta">{dataset.rows.length} 条记录<span>·</span>{dateRange[0].slice(0, 7)} — {dateRange[1].slice(0, 7)}</span></div><div className="dataset-picker" ref={datasetPicker}><button className="dataset-switch" aria-expanded={showDatasets} onClick={() => setShowDatasets(!showDatasets)}>切换数据集<ChevronDown size={15} className={showDatasets ? 'rotated' : ''}/></button>{showDatasets && <div className="dataset-menu"><p>选择演示数据或导入自己的数据</p>{datasets.map(item => <button key={item.id} onClick={() => chooseDataset(item)}><FileSpreadsheet size={16}/><span><strong>{item.label}</strong><small>{item.rows.length} 条记录 · {item.currency}</small></span>{dataset.id === item.id && <Check size={15}/>}</button>)}<button className="menu-upload" onClick={() => { setShowDatasets(false); setShowUpload(true); }}><Upload size={16}/>导入我的 CSV</button></div>}</div></section>
      <div className="data-context"><p>{dataset.note}</p><label><SlidersHorizontal size={13}/><span className="visually-hidden">按地区筛选</span><select aria-label="按地区筛选" value={region} onChange={event => setRegion(event.target.value)}><option>全部地区</option>{regions.map(item => <option key={item}>{item}</option>)}</select></label></div>
      {tab === 'overview' && <><Kpis stats={stats} currency={dataset.currency}/><div className="primary-grid"><RevenueChart key={dataset.id} stats={stats} currency={dataset.currency}/><InsightPanel stats={stats} currency={dataset.currency} onReport={() => goTo('report')}/></div><div className="secondary-grid"><ProductChart stats={stats} currency={dataset.currency}/><RegionTable stats={stats} currency={dataset.currency}/></div></>}
      {tab === 'dataset' && <DataView key={dataset.id} rows={rows} currency={dataset.currency} name={dataset.name}/>}
      {tab === 'report' && <ReportView dataset={dataset} stats={stats} region={region} onExport={exportReport}/>}
      <footer className="site-footer"><p><ShieldCheck size={13}/>数据留在你的浏览器，判断掌握在你手中。</p><span>Richon Agent<span className="footer-divider">/</span>CLARITY BEFORE ACTION</span></footer>
    </main>
    {showUpload && <UploadDialog onClose={() => setShowUpload(false)} onImport={imported}/>}
    {toast && <div className="toast" role="status"><Check size={17}/><span>{toast}</span><button className="icon-button" onClick={() => setToast('')} aria-label="关闭提示"><X size={14}/></button></div>}
  </>;
}
