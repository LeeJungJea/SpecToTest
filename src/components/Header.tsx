import React from 'react';
import { Terminal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header style={{
      display: 'flex',
      height: '3rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #1e293b',
      backgroundColor: '#020617',
      padding: '0 1rem',
      fontFamily: 'Inter, ui-sans-serif, system-ui'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <span style={{ display: 'block', height: '0.75rem', width: '0.75rem', borderRadius: '9999px', backgroundColor: '#f43f5e' }} />
          <span style={{ display: 'block', height: '0.75rem', width: '0.75rem', borderRadius: '9999px', backgroundColor: '#fbbf24' }} />
          <span style={{ display: 'block', height: '0.75rem', width: '0.75rem', borderRadius: '9999px', backgroundColor: '#34d399' }} />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          borderLeft: '1px solid #1e293b', 
          paddingLeft: '0.75rem',
          height: '100%'
        }}>
          <Terminal size={17} color="#67e8f9" strokeWidth={2} style={{ display: 'block' }} />
          <strong style={{ 
            fontSize: '0.875rem', 
            lineHeight: '1.25rem', 
            fontWeight: 600, 
            color: '#f1f5f9' 
          }}>
            SpecToTest
          </strong>
          <span style={{ 
            display: 'inline-block',
            borderRadius: '0.25rem', 
            backgroundColor: '#1e293b', 
            padding: '0.125rem 0.5rem', 
            fontSize: '0.75rem', 
            lineHeight: '1rem',
            color: '#94a3b8' 
          }}>
            devtools
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
