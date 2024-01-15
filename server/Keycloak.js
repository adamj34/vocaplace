import Keycloak from 'keycloak-connect';

const config = {
    "realm": "react-app",
    "auth-server-url": "http://localhost:8080/",
    "ssl-required": "external",
    "resource": "app-backend",
    "public-client": true,
    "confidential-port": 0,
    "clientId": "app-backend"
}

const keycloak = new Keycloak(config)
app.use(keycloak.middleware());  

export default keycloak