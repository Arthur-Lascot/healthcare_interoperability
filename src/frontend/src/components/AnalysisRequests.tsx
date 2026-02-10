import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/ApiService';

const AnalysisRequests: React.FC = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'cr' | 'transfert'>('cr');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // CR Form State
  const [crData, setCRData] = useState({
    resourceType: 'DocumentReference',
    status: 'current',
    date: new Date().toISOString().split('T')[0],
    custodian: 'Hopital Central',
    description: 'Compte Rendu Médical',
    docStatus: 'final',
    content: 'http://backend1:3002/api/pdf/download/your-pdf-id-here',
  });

  // Transfert Form State
  const [transfertData, setTransfertData] = useState({
    status: 'current',
    date: new Date().toISOString().split('T')[0],
    custodian: 'Hopital Central',
    description: 'Demande de transfert d\'analyse',
    docStatus: 'preliminary',
    content: 'http://backend1:3002/api/pdf/download/your-pdf-id-here',
    appointmentStart: new Date().toISOString().substring(0, 16),
    appointmentEnd: new Date(Date.now() + 3600000).toISOString().substring(0, 16),
    appointmentLocation: 'Laboratoire Central',
  });

  const handleCRChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCRData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransfertData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCR = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      let token = getToken();
      console.log('🎫 Token initial:', token);
      
      if (!token) {
        // Try to refresh token
        console.log('🔄 Token manquant, tentative de rafraîchissement...');
        throw new Error('Token non disponible - veuillez vous authentifier');
      }

      const uuid = await ApiService.createCR(crData, token);
      setMessage({ type: 'success', text: `✅ CR créé avec succès! UUID: ${uuid}` });
      setCRData({
        resourceType: 'DocumentReference',
        status: 'current',
        date: new Date().toISOString().split('T')[0],
        custodian: 'Hopital Central',
        description: 'Compte Rendu Médical',
        docStatus: 'final',
        content: 'http://backend1:3002/api/pdf/download/your-pdf-id-here',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('❌ Erreur CR:', errorMessage);
      setMessage({ type: 'error', text: `❌ Erreur: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfertAnalyse = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const token = getToken();
      if (!token) throw new Error('Token non disponible');

      const result = await ApiService.sendTransfertAnalyseRequest(transfertData, token);
      setMessage({ type: 'success', text: `✅ Analyse transférée avec succès!` });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: `❌ Erreur: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2>Demandes d'Analyse</h2>

      {message && (
        <div
          style={{
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            borderRadius: '4px',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('cr')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'cr' ? '#007bff' : '#e9ecef',
            color: activeTab === 'cr' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'cr' ? 'bold' : 'normal',
          }}
        >
          Créer Compte Rendu
        </button>
        <button
          onClick={() => setActiveTab('transfert')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'transfert' ? '#28a745' : '#e9ecef',
            color: activeTab === 'transfert' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'transfert' ? 'bold' : 'normal',
          }}
        >
          Transférer Analyse
        </button>
      </div>

      {/* CR Tab */}
      {activeTab === 'cr' && (
        <form onSubmit={handleCreateCR} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '20px' }}>
          <h3>Créer un Compte Rendu</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
              <input
                type="text"
                name="status"
                value={crData.status}
                onChange={handleCRChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
              <input
                type="date"
                name="date"
                value={crData.date}
                onChange={handleCRChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Custodian:</label>
              <input
                type="text"
                name="custodian"
                value={crData.custodian}
                onChange={handleCRChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Doc Status:</label>
              <input
                type="text"
                name="docStatus"
                value={crData.docStatus}
                onChange={handleCRChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
            <textarea
              name="description"
              value={crData.description}
              onChange={handleCRChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'Arial',
              }}
            />
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL du Contenu:</label>
            <input
              type="text"
              name="content"
              value={crData.content}
              onChange={handleCRChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
              placeholder="http://backend1:3002/api/pdf/download/pdf-id"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Création en cours...' : 'Créer Compte Rendu'}
          </button>
        </form>
      )}

      {/* Transfert Tab */}
      {activeTab === 'transfert' && (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '20px' }}>
          <h3>Transférer une Demande d'Analyse</h3>
          
          {/* DocumentReference Fields */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginTop: 0 }}>Document Reference</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={transfertData.status}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={transfertData.date}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Custodian:</label>
                <input
                  type="text"
                  name="custodian"
                  value={transfertData.custodian}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Doc Status:</label>
                <input
                  type="text"
                  name="docStatus"
                  value={transfertData.docStatus}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                name="description"
                value={transfertData.description}
                onChange={handleTransfertChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'Arial',
                }}
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL du Contenu:</label>
              <input
                type="text"
                name="content"
                value={transfertData.content}
                onChange={handleTransfertChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
                placeholder="http://backend1:3002/api/pdf/download/pdf-id"
              />
            </div>
          </div>

          {/* Appointment Fields */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <h4 style={{ marginTop: 0 }}>Rendez-vous (Appointment)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Début:</label>
                <input
                  type="datetime-local"
                  name="appointmentStart"
                  value={transfertData.appointmentStart}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fin:</label>
                <input
                  type="datetime-local"
                  name="appointmentEnd"
                  value={transfertData.appointmentEnd}
                  onChange={handleTransfertChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lieu:</label>
              <input
                type="text"
                name="appointmentLocation"
                value={transfertData.appointmentLocation}
                onChange={handleTransfertChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <button
            onClick={handleTransfertAnalyse}
            disabled={loading}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Transfert en cours...' : 'Transférer Analyse'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisRequests;
