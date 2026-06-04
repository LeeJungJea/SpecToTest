import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid var(--color-border)',
      color: 'var(--color-text-muted)',
      fontSize: '0.85rem',
      marginTop: '3rem'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>SpecToTest © {new Date().getFullYear()} — Part of SpecSuite</div>
      <div>
        <a href="https://github.com/LeeJungJea/SpecToTest" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-cyan)', textDecoration: 'none' }}>
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer;
