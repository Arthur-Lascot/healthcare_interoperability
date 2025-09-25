// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/ApiService';

interface FileData {
  // Ajustez selon la structure de réponse de votre API
  uuid: string;
  [key: string]: any;
}

const SearchBar: React.FC = () => {
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { getToken } = useAuth();

  const searchFile = async () => {
    if (!uuid.trim()) {
      setError('Veuillez saisir un UUID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Token d\'authentification non disponible');
      }

      console.log('🔍 Recherche du fichier UUID:', uuid);
      console.log('🔑 Token utilisé:', token.substring(0, 50) + '...');

      const data = await ApiService.getFile(uuid, token);
      console.log('📄 Données reçues:', data);
      setResult(data);

    } catch (err) {
      console.error('❌ Erreur lors de la recherche:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchFile();
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
    setUuid('');
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>🔍 Recherche de fichier</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Saisissez l'UUID du fichier"
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !uuid.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              minWidth: '100px'
            }}
          >
            {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
          </button>
          {(result || error) && (
            <button
              type="button"
              onClick={clearResults}
              style={{
                padding: '10px 15px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🗑️ Effacer
            </button>
          )}
        </div>
      </form>

      {/* Affichage des erreurs */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>❌ Erreur:</strong> {error}
        </div>
      )}

      {/* Affichage des résultats */}
      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <h3>✅ Fichier trouvé</h3>
          <div style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            border: '1px solid #c3e6cb'
          }}>
            <pre style={{ 
              margin: 0, 
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;