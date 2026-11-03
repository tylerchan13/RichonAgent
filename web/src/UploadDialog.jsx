import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Download, FileSpreadsheet, Upload, X, AlertCircle } from 'lucide-react';
import { normalizeRows } from './analytics';
import { parseCSV } from './data';

const FIELDS = [['date', '日期', true], ['revenue', '销售额', true], ['profit', '利润'], ['units', '数量'], ['product', '产品'], ['region', '地区']];

export default function UploadDialog({ onClose, onImport }) {
  const dialog = useRef(null);
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [mapping, setMapping] = useState({});
  const [currency, setCurrency] = useState('HKD');
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const validation = useMemo(() => file ? normalizeRows(file.raw, mapping) : null, [file, mapping]);
  useEffect(() => { const current = dialog.current; current.showModal(); return () => current.close(); }, []);

  async function readFile(selected) {
    if (!selected) return;
    setError('');
    if (!selected.name.toLowerCase().endsWith('.csv')) { setError('请选择 .csv 格式的文件。Excel 文件请先另存为 CSV。'); return; }
    if (selected.size > 5 * 1024 * 1024) { setError('文件超过 5 MB，请缩小数据范围后重试。'); return; }
    setReading(true);
    try {
      const content = await selected.text();
      if (content.includes('\uFFFD')) throw new Error('文件编码无法识别，请将 CSV 另存为 UTF-8 编码。');
      const parsed = parseCSV(content);
      setFile({ ...parsed, name: selected.name });
      setMapping(parsed.mapping);
    } catch (failure) { setError(failure.message); }
    finally { setReading(false); if (fileInput.current) fileInput.current.value = ''; }
  }

  function submit(event) {
    event.preventDefault();
    if (!file || reading || validation.errors.length) return;
    onImport({ id: 'uploaded', name: file.name, label: '我的数据', rows: validation.rows, currency, note: '本地上传 · 仅保留在当前页面内存中' });
  }

  return <dialog ref={dialog} className="upload-dialog" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}><form onSubmit={submit}>
    <div className="dialog-header"><div><p className="tiny-label">YOUR DATA. YOUR CLARITY.</p><h2>导入业务数据</h2><p>从一份 CSV，开始看清业务。</p></div><button className="icon-button" type="button" aria-label="关闭上传窗口" onClick={onClose}><X size={20}/></button></div>
    <input ref={fileInput} type="file" accept=".csv,text/csv" className="visually-hidden" aria-label="选择 CSV 文件" onChange={event => readFile(event.target.files[0])}/>
    {!file ? <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); readFile(event.dataTransfer.files[0]); }}><span className="upload-symbol"><Upload size={24}/></span><h3>{reading ? '正在读取文件…' : '把 CSV 文件拖到这里'}</h3><p>UTF-8 编码 · 最大 5 MB · 最多 50,000 行</p><button className="button button-dark" type="button" disabled={reading} onClick={() => fileInput.current.click()}>选择文件<ArrowRight size={15}/></button></div> : <>
      <div className="imported-file"><FileSpreadsheet size={21}/><div><strong>{file.name}</strong><span>{file.raw.length.toLocaleString('en-US')} 行 · {file.columns.length} 列</span></div><button type="button" className="text-link" disabled={reading} onClick={() => fileInput.current.click()}>更换文件</button></div>
      <div className="mapping-title"><h3>确认字段对应</h3><span>* 必填字段</span></div>
      <div className="mapping-grid">{FIELDS.map(([key, label, required]) => <label key={key}>{label}{required && <span className="required"> *</span>}<select aria-label={`${label}字段`} value={mapping[key] ?? ''} onChange={event => setMapping({ ...mapping, [key]: event.target.value })}><option value="">{required ? '请选择对应列' : '不使用此字段'}</option>{file.columns.map(column => <option key={column} value={column}>{column}</option>)}</select></label>)}</div>
      <label className="currency-field">数据币种<select aria-label="数据币种" value={currency} onChange={event => setCurrency(event.target.value)}><option value="HKD">HKD · 港币</option><option value="USD">USD · 美元</option><option value="CNY">CNY · 人民币</option></select><span>仅指定展示单位，不进行汇率换算。</span></label>
      {validation.errors.length ? <div className="validation-error" role="alert"><AlertCircle size={16}/><div><strong>请修正数据后重试</strong><p>{validation.errors.slice(0, 3).join(' ')}{validation.errors.length > 3 && ` 另有 ${validation.errors.length - 3} 项错误。`}</p></div></div> : <div className="validation-ok"><Check size={15}/>{validation.rows.length.toLocaleString('en-US')} 行校验通过，可以开始分析</div>}
    </>}
    {error && <p className="file-error" role="alert"><AlertCircle size={15}/>{error}</p>}
    <div className="upload-help"><span>需要参考格式？</span><a href="/sample_sales.csv" download><Download size={13}/>下载 CSV 样例</a></div>
    <div className="dialog-footer"><p>数据只在你的浏览器中处理，不会上传至服务器。</p><button className="button button-dark" disabled={!file || reading || !!validation?.errors.length} type="submit">开始分析<ArrowRight size={15}/></button></div>
  </form></dialog>;
}
