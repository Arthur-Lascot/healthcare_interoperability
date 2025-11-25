const supertest = require('supertest');
const { getToken, BACKEND_BASE } = require('./helper');
const fs = require('fs');
const path = require('path');

describe('GET /api/DocumentReference/:uuid', () => {
  let token;
  let sharedState = {};

  beforeAll(async () => {
    token = await getToken();
    
    const sharedStatePath = path.join(__dirname, '../temp/shared.json');
    if (fs.existsSync(sharedStatePath)) {
      sharedState = JSON.parse(fs.readFileSync(sharedStatePath, 'utf8'));
    }
  });

  test('should return 200 and correct JSON', async () => {
    expect(sharedState.createdFileUuid).toBeDefined();
    const uuid = sharedState.createdFileUuid;

    const res = await supertest(BACKEND_BASE)
      .get(`/api/DocumentReference/${uuid}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  test('should return 404 for unknown UUID', async () => {
    const res = await supertest(BACKEND_BASE)
      .get(`/api/DocumentReference/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });
});
