import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { 
  SiReact, SiNextdotjs, SiVuedotjs, SiNuxt, SiAngular, SiSvelte, SiSolid, SiPreact,
  SiJavascript, SiTypescript, SiSpringboot, SiNodedotjs, SiFastapi, SiGo, 
  SiDotnet, SiLaravel, SiRubyonrails, SiKotlin, SiRust, SiElixir 
} from 'react-icons/si';

interface LanguageSelectorProps {
  onLanguageSelect: (type: 'frontend' | 'backend', lang: string) => void;
}

const frontendLanguages = [
  { id: 'REACT_TYPESCRIPT', name: 'React TypeScript', testStack: 'Jest + RTL', icon: <SiReact color="#61DAFB" /> },
  { id: 'NEXT_JS', name: 'Next.js', testStack: 'Jest + RTL', icon: <SiNextdotjs color="#ffffff" /> },
  { id: 'VUE_3', name: 'Vue 3', testStack: 'Vitest + Vue Test Utils', icon: <SiVuedotjs color="#4FC08D" /> },
  { id: 'NUXT_JS', name: 'Nuxt.js', testStack: 'Vitest', icon: <SiNuxt color="#00DC82" /> },
  { id: 'ANGULAR', name: 'Angular', testStack: 'Jasmine + Karma', icon: <SiAngular color="#DD0031" /> },
  { id: 'SVELTE', name: 'Svelte', testStack: 'Vitest + Svelte Testing Library', icon: <SiSvelte color="#FF3E00" /> },
  { id: 'SOLID_JS', name: 'Solid.js', testStack: 'Vitest', icon: <SiSolid color="#2C4F7C" /> },
  { id: 'PREACT', name: 'Preact', testStack: 'Jest', icon: <SiPreact color="#673AB8" /> },
  { id: 'VANILLA_TYPESCRIPT', name: 'Vanilla TS', testStack: 'Jest', icon: <SiTypescript color="#3178C6" /> },
  { id: 'VANILLA_JAVASCRIPT', name: 'Vanilla JS', testStack: 'Jest', icon: <SiJavascript color="#F7DF1E" /> },
];

const backendLanguages = [
  { id: 'JAVA_SPRING_BOOT', name: 'Java Spring Boot', testStack: 'JUnit 5', icon: <SiSpringboot color="#6DB33F" /> },
  { id: 'NODE_TYPESCRIPT', name: 'Node TypeScript', testStack: 'Jest + Supertest', icon: <SiNodedotjs color="#339933" /> },
  { id: 'PYTHON_FASTAPI', name: 'Python FastAPI', testStack: 'PyTest + httpx', icon: <SiFastapi color="#009688" /> },
  { id: 'GO_GIN', name: 'Go Gin', testStack: 'Go testing + httptest', icon: <SiGo color="#00ADD8" /> },
  { id: 'CSHARP_DOTNET', name: 'C# .NET', testStack: 'xUnit + WebApplicationFactory', icon: <SiDotnet color="#512BD4" /> },
  { id: 'PHP_LARAVEL', name: 'PHP Laravel', testStack: 'PHPUnit + Laravel HTTP Tests', icon: <SiLaravel color="#FF2D20" /> },
  { id: 'RUBY_ON_RAILS', name: 'Ruby on Rails', testStack: 'RSpec + request specs', icon: <SiRubyonrails color="#CC0000" /> },
  { id: 'KOTLIN_KTOR', name: 'Kotlin Ktor', testStack: 'JUnit 5 + Ktor Test', icon: <SiKotlin color="#7F52FF" /> },
  { id: 'RUST_ACTIX', name: 'Rust Actix', testStack: 'Rust test + actix-web test', icon: <SiRust color="#ffffff" /> },
  { id: 'ELIXIR_PHOENIX', name: 'Elixir Phoenix', testStack: 'ExUnit + ConnCase', icon: <SiElixir color="#4E2A8E" /> },
];

const STACK_OPTIONS = [
  { id: 'frontend', name: 'Frontend', icon: '🎨' },
  { id: 'backend', name: 'Backend', icon: '⚙️' }
];

function Dropdown({ options, value, onChange }: { options: any[], value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const selected = options.find(o => o.id === value) || options[0];

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={ref}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#020617',
          border: '1px solid #334155',
          borderRadius: '0.375rem',
          color: '#e2e8f0',
          fontSize: '0.875rem',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ flexShrink: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center' }}>{selected.icon}</span>
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.name}</span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>▾</span>
      </button>

      {open && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '0.5rem',
          width: '100%',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '0.375rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 50,
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        }}>
          {options.map(opt => (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ flexShrink: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center' }}>{opt.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{opt.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');
  const [selectedLang, setSelectedLang] = useState<string>('REACT_TYPESCRIPT');

  const handleTabChange = (tab: string) => {
    const newTab = tab as 'frontend' | 'backend';
    setActiveTab(newTab);
    const firstLang = newTab === 'frontend' ? frontendLanguages[0].id : backendLanguages[0].id;
    setSelectedLang(firstLang);
    onLanguageSelect(newTab, firstLang);
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    onLanguageSelect(activeTab, lang);
  };

  const currentList = activeTab === 'frontend' ? frontendLanguages : backendLanguages;
  const currentLangObj = currentList.find(l => l.id === selectedLang);

  return (
    <section className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>Generators</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Select stack and output target.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: '#94a3b8', marginBottom: '0.5rem' }}>Stack</label>
          <Dropdown options={STACK_OPTIONS} value={activeTab} onChange={handleTabChange} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: '#94a3b8', marginBottom: '0.5rem' }}>Target Language</label>
          <Dropdown options={currentList} value={selectedLang} onChange={handleLangChange} />
        </div>
      </div>
      
      {currentLangObj && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>{currentLangObj.icon}</span>
          <span>
            <strong style={{ color: 'var(--color-text)' }}>{currentLangObj.name}</strong> → {currentLangObj.testStack}
          </span>
        </div>
      )}
    </section>
  );
};

export default LanguageSelector;
