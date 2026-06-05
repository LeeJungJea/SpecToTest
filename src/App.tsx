import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import LanguageSelector from './components/LanguageSelector';
import OutputSection from './components/OutputSection';
import type { ParsedApiSpec } from './types';
import { generateTestCode } from './generators/generatorRegistry';
import { Play, RotateCcw } from 'lucide-react';
import './styles/index.css';

const App: React.FC = () => {
  const [apiSpec, setApiSpec] = useState<ParsedApiSpec | null>(null);
  const [selectedType, setSelectedType] = useState<'frontend' | 'backend'>('frontend');
  const [selectedLang, setSelectedLang] = useState<string>('REACT_TYPESCRIPT');
  
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [resetKey, setResetKey] = useState(0);

  const handleGenerate = () => {
    if (!apiSpec) {
      alert('Please specify an API endpoint first (via Manual Input or OpenAPI Import).');
      return;
    }

    const { code, filename } = generateTestCode(apiSpec, selectedType, selectedLang);
    setGeneratedCode(code);
    setFilename(filename);
  };

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setGeneratedCode('');
    setFilename('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      
      <section className="main-layout">
        <div className="panel-left">
          <InputSection 
            onSpecChange={setApiSpec} 
            resetTrigger={resetKey}
            generatorSection={
              <>
                <LanguageSelector onLanguageSelect={(type, lang) => {
                  setSelectedType(type);
                  setSelectedLang(lang);
                }} />

                <div style={{ marginTop: '0.5rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem', gap: '0.5rem' }}
                    onClick={handleGenerate}
                  >
                    <Play size={16} /> Generate
                  </button>
                  <button 
                    type="button" 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem', gap: '0.5rem', borderRadius: '0.375rem', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#e2e8f0', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                    onClick={handleReset}
                  >
                    <RotateCcw size={16} /> Reset
                  </button>
                </div>
              </>
            }
          />
        </div>

        <div className="panel-right">
          <OutputSection code={generatedCode} filename={filename} />
        </div>
      </section>
    </div>
  );
};

export default App;
