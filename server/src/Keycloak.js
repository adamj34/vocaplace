import Keycloak from 'keycloak-connect';

const keycloak_port = process.env.KEYCLOAK_PORT || 8080;
const keycloak_realm = process.env.KEYCLOAK_REALM || "react-app";
const keycloak_client_id = process.env.KEYCLOAK_CLIENT_ID || "app-backend";
const keycloak_realm_public_key = process.env.KEYCLOAK_REALM_PUBLIC_KEY

const config = {
    realm: keycloak_realm,
    serverUrl: `http://localhost:${keycloak_port}/`,
    bearerOnly: true,
    clientId: keycloak_client_id,
    realmPublicKey: keycloak_realm_public_key
}

const keycloak = new Keycloak({}, config)

export default keycloak
