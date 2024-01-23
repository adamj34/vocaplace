import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";

export function Repetitions() {
    document.title = `VocaPlace | Repetitions`

    const C = useContext(AppContext);
    const [Repetitions, SetRepetitions] = useState([]);

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Repetitions">
            <div id='header'>
                <h1>Repetitions</h1>
                <p>Practice makes perfect.</p>
            </div>
            <p>Coming Soon</p>
        </div>
        
    )
}