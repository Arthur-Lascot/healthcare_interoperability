const supertest = require('supertest');
const { getToken, BACKEND_BASE } = require('./helper');
const fs = require('fs');
const path = require('path');

describe('GET /api/DocumentReferences', () => {
  let token;
  let sharedState = {};

  beforeAll(async () => {
    token = await getToken();
    const sharedStatePath = path.join(__dirname, '../temp/shared.json');
    if (fs.existsSync(sharedStatePath)) {
      sharedState = JSON.parse(fs.readFileSync(sharedStatePath, 'utf8'));
    }
  });

  test('should return 200 and a Bundle of DocumentReferences', async () => {
    const res = await supertest(BACKEND_BASE)
      .get('/api/DocumentReferences')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.resourceType).toBe('Bundle');
    expect(res.body.type).toBe('searchset');
    expect(res.body.entry).toBeInstanceOf(Array);

    if (res.body.entry.length > 0) {
      const createdFileEntry = res.body.entry.find(e => 
        e.resource && 
        e.resource.type &&
        e.resource.type.coding &&
        e.resource.type.coding.some(c => c.display === 'Summarization of episode note')
      );
      expect(createdFileEntry).toBeDefined();
    }
  });
});
