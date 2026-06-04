import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import LanguageSelector from './components/LanguageSelector';
import OutputSection from './components/OutputSection';
import type { ParsedApiSpec } from './types';
import { generateTestCode } from './generators/generatorRegistry';
import './styles/index.css';

const App: React.FC = () => {
  const [apiSpec, setApiSpec] = useState<ParsedApiSpec | null>(null);
  const [selectedType, setSelectedType] = useState<'frontend' | 'backend'>('frontend');
  const [selectedLang, setSelectedLang] = useState<string>('REACT_TYPESCRIPT');
  
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [filename, setFilename] = useState<string>('');

  const handleGenerate = () => {
    if (!apiSpec) {
      alert('Please specify an API endpoint first (via Manual Input or OpenAPI Import).');
      return;
    }

    const { code, filename } = generateTestCode(apiSpec, selectedType, selectedLang);
    setGeneratedCode(code);
    setFilename(filename);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      
      <section className="main-layout">
        <div className="panel-left">
          <InputSection onSpecChange={setApiSpec} />
          
          <LanguageSelector onLanguageSelect={(type, lang) => {
            setSelectedType(type);
            setSelectedLang(lang);
          }} />

          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              onClick={handleGenerate}
            >
              Generate Test Code
            </button>
          </div>
        </div>

        <div className="panel-right">
          <OutputSection code={generatedCode} filename={filename} />
        </div>
      </section>
    </div>
  );
};

export default App;
