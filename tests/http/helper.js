const supertest = require('supertest');

const API_BASE = 'http://localhost:8080';
const BACKEND_BASE = 'http://localhost:3002';

const TEST_USER_USERNAME = process.env.TEST_USER_USERNAME;
const TEST_USER_PWD = process.env.TEST_USER_PWD;

async function getToken() {
  const res = await supertest(API_BASE)
    .post('/realms/healthcare/protocol/openid-connect/token')
    .type('form')
    .send(`client_id=HealthApp&grant_type=password&username=${TEST_USER_USERNAME}&password=${TEST_USER_PWD}`);
    
  if (!res.body.access_token) throw new Error('Token not received');
  return res.body.access_token;
}

module.exports = { BACKEND_BASE, getToken };