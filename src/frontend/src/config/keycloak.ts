// src/config/keycloak.ts
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'healthcare',
  clientId: 'HealthApp',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;