import { FileFormData } from "../components/FileManagement";

class ApiService {
  private baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';
  
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
            data: undefined
          }
        }
      ]
    };

    const response = await fetch(`${this.baseUrl}/document`, {
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
}

export default new ApiService();