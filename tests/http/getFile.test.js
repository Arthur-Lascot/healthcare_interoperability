const supertest = require('supertest');
const { getToken, BACKEND_BASE } = require('./helper');
const sharedState = require('./sharedState');

describe('GET /api/DocumentReference/:uuid', () => {
  let token;

  beforeAll(async () => {
    token = await getToken();
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
    const res = await supertest(API_BASE)
      .get(`/api/file/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });
});
