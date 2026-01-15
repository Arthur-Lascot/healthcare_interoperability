import { FileFormData } from "../components/FileManagement";

class ApiService {
  private baseUrl = process.env.REACT_APP_BACKEND_URL;
  
  constructor() {
    // Ensure baseUrl ends with /api if not already present
    if (!this.baseUrl.endsWith('/api')) {
      this.baseUrl = `${this.baseUrl}/api`;
    }
  }

  async getFile(uuid: string, token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/DocumentReference/${uuid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé - Vérifiez votre authentification');
      } else if (response.status === 404) {
        throw new Error('Fichier non trouvé');
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    }

    return response.json();
  }

  async getDocumentReferences(token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/DocumentReferences`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé - Vérifiez votre authentification');
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    }

    return response.json();
  }

  async createFile(data: FileFormData, token: string): Promise<any> {
    const documentReferencePayload = {
      status: "current",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: data.code,
            display: data.display
          }
        ]
      },
      subject: {
        reference: "Patient/12345"
      },
      author: {
        reference: "Practitioner/67890"
      },
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: "localhost:3005/api/pdf/download/your-pdf-id-here"
          }
        }
      ]
    };

    const response = await fetch(`http://localhost:3003/api/CR`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify(documentReferencePayload),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadPDF(file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/pdf/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.pdf_id;
  }

  async downloadPDF(pdfId: string, token: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/pdf/download/${pdfId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  }

  async deletePDF(pdfId: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/pdf/${pdfId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  }

  async createCR(crData: { status: string; date: string; custodian: string; description: string; docStatus: string; content: string }, token: string): Promise<string> {
    console.log('📤 Envoi CR avec token:', token ? `${token.substring(0, 20)}...` : 'undefined');
    
    const documentReferencePayload = {
      resourceType: 'DocumentReference',
      status: crData.status,
      docStatus: crData.docStatus,
      date: crData.date,
      description: crData.description,
      custodian: crData.custodian,
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "34133-9",
            display: "Clinical Encounter note"
          }
        ]
      },
      subject: {
        reference: "Patient/12345"
      },
      author: {
        reference: "Practitioner/67890"
      },
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: crData.content
          }
        }
      ]
    };

    const response = await fetch(`http://localhost:3003/api/CR`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentReferencePayload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('❌ Réponse serveur:', response.status, errBody);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.uuid;
  }

  async sendTransfertAnalyseRequest(transfertData: any, token: string): Promise<any> {
    console.log('📦 Création du Bundle avec DocumentReference + Appointment');
    
    // Build DocumentReference
    const documentReference = {
      resourceType: 'DocumentReference',
      status: transfertData.status,
      docStatus: transfertData.docStatus,
      date: transfertData.date,
      description: transfertData.description,
      custodian: transfertData.custodian,
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "11488-4",
            display: "Consultation note"
          }
        ]
      },
      subject: {
        reference: "Patient/12345"
      },
      author: {
        reference: "Practitioner/67890"
      },
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: transfertData.content
          }
        }
      ]
    };

    // Build Appointment
    const appointment = {
      resourceType: 'Appointment',
      status: 'proposed',
      start: transfertData.appointmentStart,
      end: transfertData.appointmentEnd,
      participants: [
        { 
          actor: { 
            display: transfertData.appointmentLocation 
          },
          status: 'accepted'
        }
      ],
      description: `Rendez-vous pour ${transfertData.description}`
    };

    // Build Bundle
    const bundlePayload = {
      resourceType: 'Bundle',
      type: 'message',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:${crypto.randomUUID()}`,
          resource: documentReference
        },
        {
          fullUrl: `urn:uuid:${crypto.randomUUID()}`,
          resource: appointment
        }
      ]
    };

    console.log('📤 Envoi Bundle:', JSON.stringify(bundlePayload, null, 2));

    const response = await fetch(`${this.baseUrl}/TransfertAnalyseRequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bundlePayload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('❌ Réponse serveur:', response.status, errBody);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new ApiService();