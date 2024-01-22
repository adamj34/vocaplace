import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";

export function Revisions() {
    const { keycloak } = useKeycloak();
    
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Revisions`

    return (
        <div id="Revisions">
            <div id='header'>
                <h1>Revisions</h1>
                <p>Practice makes perfect.</p>
            </div>
            <p>Coming Soon</p>
        </div>
        
    )
}