import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
 url: `${window.location.protocol}//${window.location.hostname}:8080`,
 realm: "react-app",
 clientId: "app-frontend",
});

export default keycloak;