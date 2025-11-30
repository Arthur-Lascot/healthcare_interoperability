import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/ApiService';

export interface FileFormData {
  code: string;
  display: string;
}

const FileManagement: React.FC = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form data for creating files
  const [formData, setFormData] = useState<FileFormData>({
    code: '34133-9',
    display: ''
  });
  
  // Search data
  const [searchUuid, setSearchUuid] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Validate required fields
      if (!formData.display) {
        throw new Error('Le champ Display est obligatoire');
      }

      const result = await ApiService.createFile(formData, token);
      setMessage({ type: 'success', text: `Fichier créé avec succès! UUID: ${result.uuid}` });
      
      // Reset form
      setFormData({
        code: '34133-9',
        display: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la création du fichier' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSearchResult(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      if (!searchUuid.trim()) {
        throw new Error('Veuillez entrer un UUID valide');
      }

      const result = await ApiService.getFile(searchUuid.trim(), token);
      setSearchResult(result);
      setMessage({ type: 'success', text: 'Fichier trouvé avec succès!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la recherche du fichier' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Gestion des Fichiers</h2>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px', 
        borderBottom: '1px solid #ddd' 
      }}>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'create' ? '#007bff' : 'transparent',
            color: activeTab === 'create' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'create' ? '2px solid #007bff' : '2px solid transparent'
          }}
        >
          Créer un Fichier
        </button>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'search' ? '#007bff' : 'transparent',
            color: activeTab === 'search' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'search' ? '2px solid #007bff' : '2px solid transparent'
          }}
        >
          Rechercher un Fichier
        </button>
        <Link to="/document-references" style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#333',
            cursor: 'pointer',
            textDecoration: 'none',
            borderBottom: '2px solid transparent'
          }}>
          Lister les Documents
        </Link>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}

      {/* Create File Tab */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateFile} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Créer un Nouveau Fichier</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Code (obligatoire):
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Display (obligatoire):
            </label>
            <input
              type="text"
              name="display"
              value={formData.display}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Création...' : 'Créer le Fichier'}
          </button>
        </form>
      )}

      {/* Search File Tab */}
      {activeTab === 'search' && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Rechercher un Fichier</h3>
          
          <form onSubmit={handleSearchFile} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                UUID du fichier:
              </label>
              <input
                type="text"
                value={searchUuid}
                onChange={(e) => setSearchUuid(e.target.value)}
                placeholder="Entrez l'UUID du fichier..."
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>

          {/* Search Results */}
          {searchResult !== null && (
            <div style={{
              backgroundColor: '#e9ecef',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4>Contenu du fichier FHIR:</h4>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '14px'
              }}>
                {JSON.stringify(searchResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManagement;
