import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
 url: "http://localhost:8080",
 realm: "react-app",
 clientId: "app-frontend",
});

export default keycloak;