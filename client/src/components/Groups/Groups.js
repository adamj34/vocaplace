import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";

export function Groups() {
    const { keycloak } = useKeycloak();
    
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Groups`

    return (
        <div id="Groups">
            <div id='header'>
                <h1>Groups</h1>
                <p>groups</p>
            </div>
            <p>Coming Soon</p>
        </div>
        
    )
}