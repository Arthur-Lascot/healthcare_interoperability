import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import FileManagement from '../components/FileManagement';
import AnalysisRequests from '../components/AnalysisRequests';

const HomePage: React.FC = () => {
  const { user, logout, getToken } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const copyToken = () => {
    const token = getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copié dans le presse-papiers');
    }
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
        <h1>Tableau de bord</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Bonjour, {user?.firstName || user?.username}!</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

      <main>
        <SearchBar />
        
        {/* File Management Section */}
        <div style={{ marginBottom: '30px' }}>
          <FileManagement />
        </div>

        {/* Analysis Requests Section */}
        <div style={{ marginBottom: '30px' }}>
          <AnalysisRequests />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h2>Informations utilisateur</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <p><strong>Nom d'utilisateur:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Prénom:</strong> {user?.firstName}</p>
            <p><strong>Nom:</strong> {user?.lastName}</p>
            <p><strong>Rôles:</strong> {user?.roles?.join(', ') || 'Aucun'}</p>
          </div>
        </div>

        <div>
          <h2>Actions</h2>
          <button onClick={copyToken} style={{ marginRight: '10px' }}>
            Copier le token JWT
          </button>
          <button onClick={() => window.open('http://localhost:8080', '_blank')}>
            Ouvrir Keycloak Admin
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;