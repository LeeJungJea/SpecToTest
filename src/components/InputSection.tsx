import React, { useState, useEffect } from 'react';
import type { ParsedApiSpec, SchemaField, SchemaValueType, FieldRow, FieldType, BodyType, ResponseType } from '../types';
import { parseOpenAPI } from '../parsers/openapiParser';
import type { OpenAPIEndpoint } from '../parsers/openapiParser';
import { FileJson2 } from 'lucide-react';
import { FieldTableEditor, BodyTableEditor } from './EditorComponents';

interface InputSectionProps {
  onSpecChange: (spec: ParsedApiSpec) => void;
}

function rowsToSchema(rows: FieldRow[]): SchemaField[] {
  return rows.filter(r => r.key.trim() !== '').map(row => ({
    name: row.key.trim(),
    type: (row.type === 'file' ? 'unknown' : row.type) as SchemaValueType,
    required: row.required
  }));
}

function schemaToRows(fields: SchemaField[]): FieldRow[] {
  return fields.map((f, i) => ({
    id: `field-${Date.now()}-${i}`,
    key: f.name,
    type: (['string', 'number', 'boolean'].includes(f.type) ? f.type : 'string') as FieldType,
    required: f.required,
    description: ''
  }));
}

type RequestTabKey = 'params' | 'headers' | 'body' | 'response';
const REQUEST_TABS: Array<{ key: RequestTabKey; title: string }> = [
  { key: 'params', title: 'URL Params' }, 
  { key: 'headers', title: 'Headers' }, 
  { key: 'body', title: 'Body' }, 
  { key: 'response', title: 'Response' }
];

const InputSection: React.FC<InputSectionProps> = ({ onSpecChange }) => {
  const [activeTab, setActiveTab] = useState<'MANUAL' | 'OPENAPI'>('MANUAL');
  const [openApiJson, setOpenApiJson] = useState('');
  const [endpoints, setEndpoints] = useState<OpenAPIEndpoint[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState('');

  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('POST');
  const [url, setUrl] = useState('/api/users');
  const [bodyType, setBodyType] = useState<BodyType>('json');
  const [responseType, setResponseType] = useState<ResponseType>('json');
  
  const [headerRows, setHeaderRows] = useState<FieldRow[]>([]);
  const [pathParamRows, setPathParamRows] = useState<FieldRow[]>([]);
  const [queryParamRows, setQueryParamRows] = useState<FieldRow[]>([]);
  const [bodyRows, setBodyRows] = useState<FieldRow[]>([]);
  const [responseRows, setResponseRows] = useState<FieldRow[]>([]);

  const [activeRequestTab, setActiveRequestTab] = useState<RequestTabKey>('params');

  const extractPathParamNames = (u: string) => [...new Set([...u.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]))];
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const names = extractPathParamNames(newUrl);
    const existingKeys = new Set(pathParamRows.map((row) => row.key.trim()).filter(Boolean));
    const keptRows = pathParamRows.filter(r => !r.key.trim() || names.includes(r.key.trim()));
    const missing = names.filter((name) => !existingKeys.has(name)).map<FieldRow>((name, i) => ({ id: `path-${Date.now()}-${i}`, key: name, type: 'string', required: true, description: 'Detected from URL' }));
    setPathParamRows([...keptRows, ...missing]);
  };

  const handleOpenApiParse = () => {
    try {
      const parsed = parseOpenAPI(openApiJson);
      setEndpoints(parsed);
    } catch (e) {
      alert('Failed to parse OpenAPI JSON');
    }
  };

  const handleSelectEndpoint = (endpointId: string) => {
    setSelectedEndpointId(endpointId);
    const endpoint = endpoints.find(e => e.id === endpointId);
    if (endpoint) {
      setMethod(endpoint.spec.method);
      setUrl(endpoint.spec.url);
      setBodyType(endpoint.spec.bodyType);
      setResponseType(endpoint.spec.responseType);
      setHeaderRows(schemaToRows(endpoint.spec.headersSchema));
      setPathParamRows(schemaToRows(endpoint.spec.pathParamsSchema));
      setQueryParamRows(schemaToRows(endpoint.spec.queryParamsSchema));
      setBodyRows(schemaToRows(endpoint.spec.inputSchema));
      setResponseRows(schemaToRows(endpoint.spec.outputSchema));
    }
  };

  useEffect(() => {
    onSpecChange({
      method,
      url,
      bodyType,
      headersSchema: rowsToSchema(headerRows),
      queryParamsSchema: rowsToSchema(queryParamRows),
      pathParamsSchema: rowsToSchema(pathParamRows),
      inputSchema: rowsToSchema(bodyRows),
      outputSchema: rowsToSchema(responseRows),
      responseType
    });
  }, [method, url, bodyType, responseType, headerRows, pathParamRows, queryParamRows, bodyRows, responseRows, onSpecChange]);

  const renderActiveEditor = () => {
    if (activeRequestTab === 'params') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: '#070b14' }}>
          <FieldTableEditor title="Path Params" subtitle="Values embedded in the route" badge="Auto-detected" rows={pathParamRows} onRowsChange={setPathParamRows} />
          <FieldTableEditor title="Query Params" subtitle="Values after ?" badge="Optional" rows={queryParamRows} onRowsChange={setQueryParamRows} />
        </div>
      );
    }
    if (activeRequestTab === 'headers') {
      return (
        <div style={{ padding: '1rem', backgroundColor: '#070b14' }}>
          <FieldTableEditor title="Headers" subtitle="Request metadata, auth tokens" badge="Optional" rows={headerRows} onRowsChange={setHeaderRows} />
        </div>
      );
    }
    if (activeRequestTab === 'body') {
      return <BodyTableEditor bodyType={bodyType} rows={bodyRows} onBodyTypeChange={setBodyType} onRowsChange={setBodyRows} />;
    }
    if (activeRequestTab === 'response') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: '#070b14' }}>
          <div style={{ borderRadius: '0.5rem', border: '1px solid var(--color-border)', padding: '1rem' }}>
            <label style={{ display: 'block', maxWidth: '320px' }}>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: '#94a3b8' }}>Response Type</span>
              <select className="input-field" style={{ height: '2.5rem' }} value={responseType} onChange={(e) => setResponseType(e.target.value as ResponseType)}>
                <option value="json">JSON (json)</option>
                <option value="text">Text (text)</option>
              </select>
            </label>
          </div>
          <FieldTableEditor title="Response" subtitle="Fields returned by the API response" badge="Output" rows={responseRows} onRowsChange={setResponseRows} />
        </div>
      );
    }
    return null;
  };

  return (
    <section style={{ marginBottom: '2rem' }}>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <button className={activeTab === 'MANUAL' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('MANUAL')} style={{ padding: '0.5rem 1rem' }}>
              Manual Input
            </button>
            <button className={activeTab === 'OPENAPI' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('OPENAPI')} style={{ padding: '0.5rem 1rem' }}>
              OpenAPI Import
            </button>
          </div>

          {activeTab === 'OPENAPI' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <textarea className="input-field" rows={4} placeholder="Paste your OpenAPI JSON here..." value={openApiJson} onChange={(e) => setOpenApiJson(e.target.value)} style={{ marginBottom: '1rem', fontFamily: 'var(--font-mono)' }} />
              <button className="btn-primary" onClick={handleOpenApiParse}>Parse JSON</button>

              {endpoints.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-cyan)', fontSize: '0.9rem' }}>Select an API:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {endpoints.map(ep => (
                      <div key={ep.id} onClick={() => handleSelectEndpoint(ep.id)} style={{ padding: '0.75rem', border: `1px solid ${selectedEndpointId === ep.id ? 'var(--color-cyan)' : 'var(--color-border)'}`, borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedEndpointId === ep.id ? 'rgba(0, 212, 255, 0.05)' : 'transparent', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text)', minWidth: '60px', fontSize: '0.8rem' }}>{ep.method}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{ep.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="input-field" style={{ width: '120px', height: '2.5rem' }} value={method} onChange={(e) => setMethod(e.target.value as any)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input className="input-field" style={{ height: '2.5rem' }} placeholder="e.g. /api/users/{id}" value={url} onChange={(e) => handleUrlChange(e.target.value)} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', minHeight: '2.5rem', overflowX: 'auto', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(15, 23, 42, 0.8)', fontSize: '0.75rem' }}>
            {REQUEST_TABS.map((tab) => {
              const active = tab.key === activeRequestTab;
              return (
                <button 
                  key={tab.key} 
                  type="button" 
                  onClick={() => setActiveRequestTab(tab.key)}
                  style={{
                    display: 'flex', flexShrink: 0, alignItems: 'center', gap: '0.5rem', borderRight: '1px solid var(--color-border)', padding: '0 1rem', fontWeight: 600, transition: 'all 0.2s', backgroundColor: 'transparent', cursor: 'pointer',
                    ...(active ? { borderTop: '2px solid var(--color-cyan)', color: '#f1f5f9', backgroundColor: '#0b1020' } : { borderTop: '2px solid transparent', color: '#64748b' })
                  }}
                  onMouseOver={(e) => { if (!active) e.currentTarget.style.color = '#cbd5e1'; }}
                  onMouseOut={(e) => { if (!active) e.currentTarget.style.color = '#64748b'; }}
                >
                  <FileJson2 size={14} />{tab.title}
                </button>
              );
            })}
          </div>
          {renderActiveEditor()}
        </div>
      </div>
    </section>
  );
};

export default InputSection;
