import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";

export function Ranking() {
    const { keycloak } = useKeycloak();
    
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Revisions`

    return (
        <div id="Ranking">
            <div id='header'>
                <h1>Ranking</h1>
                <p>whos the best</p>
            </div>
            
        </div>
        
    )
}