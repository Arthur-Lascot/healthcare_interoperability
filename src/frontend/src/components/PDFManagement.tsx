import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/ApiService';

const PDFManagement: React.FC = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadedPdfId, setUploadedPdfId] = useState<string | null>(null);
  
  // Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Download
  const [pdfIdToDownload, setPdfIdToDownload] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setUploadedPdfId(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Token d\'authentification manquant');
      if (!selectedFile) throw new Error('Veuillez sélectionner un fichier');

      const result = await ApiService.uploadPDF(selectedFile, token);
      setUploadedPdfId(result);
      setMessage({ type: 'success', text: `PDF uploadé avec succès! ID: ${result}` });
      setSelectedFile(null);
      const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Token d\'authentification manquant');
      if (!pdfIdToDownload.trim()) throw new Error('Veuillez entrer un PDF ID');

      const blob = await ApiService.downloadPDF(pdfIdToDownload.trim(), token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${pdfIdToDownload}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage({ type: 'success', text: 'PDF téléchargé!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors du téléchargement' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Gestion des PDFs</h2>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px', 
        borderBottom: '1px solid #ddd' 
      }}>
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'upload' ? '#007bff' : 'transparent',
            color: activeTab === 'upload' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'upload' ? '2px solid #007bff' : '2px solid transparent'
          }}
        >
          Uploader un PDF
        </button>
        <button
          onClick={() => setActiveTab('download')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'download' ? '#007bff' : 'transparent',
            color: activeTab === 'download' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'download' ? '2px solid #007bff' : '2px solid transparent'
          }}
        >
          Télécharger un PDF
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUploadPDF}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Fichier PDF:</label>
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Envoi...' : 'Uploader'}
          </button>

          {uploadedPdfId && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: '0 0 10px 0' }}><strong>ID du PDF:</strong></p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <code style={{ 
                  flex: 1,
                  padding: '8px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflowWrap: 'break-word'
                }}>
                  {uploadedPdfId}
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(uploadedPdfId)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: '12px'
                  }}
                >
                  Copier ID
                </button>
              </div>

              <p style={{ margin: '0 0 10px 0' }}><strong>Endpoint API:</strong></p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <code style={{ 
                  flex: 1,
                  padding: '8px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflowWrap: 'break-word'
                }}>
                  GET /api/pdf/download/{uploadedPdfId}
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`GET /api/pdf/download/${uploadedPdfId}`)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: '12px'
                  }}
                >
                  Copier
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Download Tab */}
      {activeTab === 'download' && (
        <form onSubmit={handleDownloadPDF}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>PDF ID:</label>
            <input
              type="text"
              value={pdfIdToDownload}
              onChange={(e) => setPdfIdToDownload(e.target.value)}
              placeholder="MongoDB ObjectId"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Téléchargement...' : 'Télécharger'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PDFManagement;
