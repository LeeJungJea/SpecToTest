import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OutputSectionProps {
  code: string;
  filename: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({ code, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: 'var(--color-text-muted)',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>No test code generated yet</h2>
          <p>Click Generate on the left to see the result here.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--color-surface)'
      }}>
        <h3 style={{ color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          File: <span style={{ color: 'var(--color-text)', fontWeight: 400 }}>{filename}</span>
        </h3>
        <button onClick={handleCopy} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem' }}>
          {copied ? <><Check size={16} color="#10b981" /> <span style={{ color: '#10b981' }}>Copied!</span></> : <><Copy size={16} /> Copy Code</>}
        </button>
      </div>

      <pre style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
        padding: '1.5rem 0',
        color: 'var(--color-text)',
        fontSize: '0.9rem',
        lineHeight: 1.5,
        margin: 0
      }}>
        <code style={{ display: 'flex', flexDirection: 'column' }}>
          {code.split('\n').map((line, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{
                width: '3.5rem',
                textAlign: 'right',
                paddingRight: '1rem',
                color: 'var(--color-text-muted)',
                userSelect: 'none',
                flexShrink: 0,
                opacity: 0.6
              }}>
                {i + 1}
              </span>
              <span style={{ whiteSpace: 'pre' }}>{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </section>
  );
};

export default OutputSection;
