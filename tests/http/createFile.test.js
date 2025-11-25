const supertest = require('supertest');
const { API_BASE, getToken } = require('./helper');
const sharedState = require('./sharedState');

describe('POST /api/document', () => {
  let token;

  beforeAll(async () => {
    token = await getToken();
  });

  test('should return 201 and a new UUID when creating a file', async () => {
    const documentReferencePayload = {
      status: "current",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "34133-9",
            display: "Summarization of episode note"
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

    const res = await supertest(API_BASE)
      .post('/api/document')
      .set('Authorization', `Bearer ${token}`)
      .send(documentReferencePayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('uuid');
    expect(res.body.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    sharedState.createdFileUuid = res.body.uuid;
  });
});