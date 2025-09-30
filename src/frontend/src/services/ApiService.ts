class ApiService {
  private baseUrl = 'http://localhost:3002/api';

  async getFile(uuid: string, token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/file/${uuid}`, {
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

  async createFile(data: any, token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new ApiService();