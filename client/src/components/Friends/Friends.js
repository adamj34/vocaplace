import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";

export function Friends() {
    const { keycloak } = useKeycloak();
    
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Friends`

    return (
        <div id="Friends">
            <div id='header'>
                <h1>Friends</h1>
                <p>idk i have none.</p>
            </div>
            
        </div>
        
    )
}