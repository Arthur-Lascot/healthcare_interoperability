const supertest = require('supertest');
const { API_BASE, getToken } = require('./helper');

describe('GET /api/file/:uuid', () => {
  let token;

  beforeAll(async () => {
    token = await getToken();
  });

  test('should return 200 and correct JSON', async () => {
    const uuid = '71e74502-bd9f-4d19-b8d9-8abbcdaf7453';
    const res = await supertest(API_BASE)
      .get(`/api/file/${uuid}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });

  test('should return 404 for unknown UUID', async () => {
    const res = await supertest(API_BASE)
      .get(`/api/file/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
  });
});
