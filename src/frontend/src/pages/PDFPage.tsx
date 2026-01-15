import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PDFManagement from '../components/PDFManagement';

const PDFPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '20px'
      }}>
        <h1>Gestion des PDFs</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Bonjour, {user?.firstName || user?.username}!</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

      <main>
        <PDFManagement />
      </main>
    </div>
  );
};

export default PDFPage;
