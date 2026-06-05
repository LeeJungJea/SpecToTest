import type { ReactNode } from 'react';
import type { FieldRow, FieldType, BodyType } from '../types';

const inputClass = 'input-field';

export function EditorHeader({ title, subtitle, badge, action }: { title: string; subtitle: string; badge?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '2.5rem', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#0f172a', padding: '0.5rem 1rem' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{title}</h2>
          {badge && <span style={{ flexShrink: 0, borderRadius: '0.25rem', border: '1px solid #334155', backgroundColor: '#020617', padding: '0.125rem 0.5rem', fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{badge}</span>}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, marginTop: '0.25rem' }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function FieldTable({ rows, onRowsChange, allowFile = false }: { rows: FieldRow[]; onRowsChange: (rows: FieldRow[]) => void; allowFile?: boolean }) {
  const updateRow = (id: string, patch: Partial<FieldRow>) => onRowsChange(rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  const addRow = () => onRowsChange([...rows, { id: `field-${Date.now()}`, key: '', type: 'string', required: false, description: '' }]);
  const removeRow = (id: string) => onRowsChange(rows.filter((row) => row.id !== id));
  
  return (
    <div style={{ overflow: 'auto', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
      <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
        <thead style={{ backgroundColor: '#0f172a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: '#64748b' }}>
          <tr>
            <th style={{ borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0.75rem' }}>Key</th>
            <th style={{ borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0.75rem' }}>Type</th>
            <th style={{ borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', textAlign: 'center' }}>Required</th>
            <th style={{ borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0.75rem' }}>Description</th>
            <th style={{ borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0.75rem' }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #0f172a' }}>
              <td style={{ padding: '0.5rem 0.75rem' }}>
                <input className={inputClass} style={{ height: '2.25rem', fontFamily: 'var(--font-mono)' }} value={row.key} onChange={(e) => updateRow(row.id, { key: e.target.value })} placeholder="fieldName" />
              </td>
              <td style={{ padding: '0.5rem 0.75rem' }}>
                <select className={inputClass} style={{ height: '2.25rem', minWidth: '130px', padding: '0 0.5rem' }} value={row.type} onChange={(e) => updateRow(row.id, { type: e.target.value as FieldType })}>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  {allowFile && <option value="file">file</option>}
                </select>
              </td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                <input type="checkbox" checked={row.required} onChange={(e) => updateRow(row.id, { required: e.target.checked })} />
              </td>
              <td style={{ padding: '0.5rem 0.75rem' }}>
                <input className={inputClass} style={{ height: '2.25rem' }} value={row.description} onChange={(e) => updateRow(row.id, { description: e.target.value })} placeholder="field description" />
              </td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                <button type="button" style={{ borderRadius: '0.25rem', border: '1px solid #334155', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', backgroundColor: 'transparent' }} onClick={() => removeRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ borderTop: '1px solid #1e2d4a', backgroundColor: '#020617', padding: '0.75rem' }}>
        <button type="button" style={{ borderRadius: '0.375rem', border: '1px solid #334155', padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', cursor: 'pointer', backgroundColor: 'transparent', outline: 'none' }} onClick={addRow}>
          Add field
        </button>
      </div>
    </div>
  );
}

export function FieldTableEditor({ title, subtitle, badge, rows, onRowsChange }: { title: string; subtitle: string; badge?: string; rows: FieldRow[]; onRowsChange: (rows: FieldRow[]) => void }) {
  return (
    <section style={{ overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
      <EditorHeader title={title} subtitle={subtitle} badge={badge} />
      <div style={{ padding: '0.5rem', backgroundColor: '#070b14' }}>
        <FieldTable rows={rows} onRowsChange={onRowsChange} />
      </div>
    </section>
  );
}

export function BodyTableEditor({ bodyType, rows, onBodyTypeChange, onRowsChange }: { bodyType: BodyType; rows: FieldRow[]; onBodyTypeChange: (bodyType: BodyType) => void; onRowsChange: (rows: FieldRow[]) => void }) {
  const BODY_TYPES = [
    { value: 'none', label: 'none' }, { value: 'form-data', label: 'form-data' }, { value: 'x-www-form-urlencoded', label: 'x-www-form-urlencoded' },
    { value: 'json', label: 'raw / JSON' }, { value: 'raw', label: 'raw / Text' }, { value: 'binary', label: 'binary' }, { value: 'graphql', label: 'GraphQL' }
  ];

  return (
    <section style={{ overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
      <EditorHeader title="Body" subtitle="Postman-style body builder" badge="Optional" />
      <div style={{ padding: '0.75rem', backgroundColor: '#070b14', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'block', maxWidth: '320px' }}>
          <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: '#94a3b8' }}>Body Type</span>
          <select className={inputClass} style={{ height: '2.5rem', minWidth: '130px', padding: '0 0.5rem' }} value={bodyType} onChange={(e) => onBodyTypeChange(e.target.value as BodyType)}>
            {BODY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
        {bodyType === 'none' ? (
          <div style={{ borderRadius: '0.375rem', border: '1px solid var(--color-border)', backgroundColor: '#020617', padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>This request does not use a body.</div>
        ) : bodyType === 'binary' ? (
          <div style={{ borderRadius: '0.375rem', border: '1px solid var(--color-border)', backgroundColor: '#020617', padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Binary body will be generated as a file or raw binary payload.</div>
        ) : (
          <FieldTable rows={rows} onRowsChange={onRowsChange} allowFile={bodyType === 'form-data'} />
        )}
      </div>
    </section>
  );
}
