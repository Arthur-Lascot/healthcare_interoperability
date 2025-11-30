import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/ApiService';
import { Bundle, DocumentReference, Coding } from '../types/fhir';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const DocumentReferencesPage: React.FC = () => {
  const { getToken } = useAuth();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentReferences = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await ApiService.getDocumentReferences(token);
          setBundle(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocumentReferences();
  }, [getToken]);

  const getLoincCode = (doc: DocumentReference): Coding | undefined => {
    return doc.type?.coding?.find(c => c.system === 'http://loinc.org');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Erreur: {error}</div>;
  }

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
        <h1>DocumentReferences</h1>
        <Link to="/home">
          <button>Retour</button>
        </Link>
      </header>

      <main>
        {bundle && bundle.entry && bundle.entry.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {bundle.entry.map((entry, index) => {
              const resource = entry.resource;
              if (!resource) return null;
              
              const loinc = getLoincCode(resource);

              return (
                <li key={index} style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <p><strong>Description:</strong> {resource.description || 'N/A'}</p>
                  <p><strong>LOINC Code:</strong> {loinc?.code || 'N/A'}</p>
                  <p><strong>Display:</strong> {loinc?.display || 'N/A'}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucun document trouvé.</p>
        )}
      </main>
    </div>
  );
};

export default DocumentReferencesPage;
