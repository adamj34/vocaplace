import Keycloak from "keycloak-js";

const keycloak_port = process.env.REACT_APP_KEYCLOAK_PORT || 8080;
const keycloak_realm = process.env.REACT_APP_KEYCLOAK_REALM || "react-app";
const keycloak_client_id = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "app-frontend";

const keycloak = new Keycloak({
 url: `${window.location.protocol}//${window.location.hostname}:${keycloak_port}`,
 realm: keycloak_realm,
 clientId: keycloak_client_id,
 pkceMethod: 'S256',
});

export default keycloak;
