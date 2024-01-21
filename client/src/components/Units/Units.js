import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { Link } from "react-router-dom";
import DataService from "../../DataService";
import { useContext } from "react";
import { AppContext } from '../../App';
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function Button(p) {
    return (
        <div id='button'>
            <Link to={p.data.unitid}>
                <div id='title' className="hovertext">
                    <i id='icon' className="fa-solid fa-book"></i>
                    <p>{p.data.unit}</p>
                </div>
            </Link>
            <ProgressBar completion={parseInt(p.data.completion_ratio)}/>
        </div>
    )
}

export function Units() {
    document.title = `VocaPlace | Units`
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    const C = useContext(AppContext);
    const [Units, SetUnits] = useState([]);
    
    useEffect(() => {
        if (C.AppReady) {
            DataService.GetUnits().then((data) => {
                const formatted = Object.entries(data.data).map(([unitid, d]) => {
                    return { unitid, ...d }
                })
                SetUnits(formatted)
                console.log(formatted)
            })
        }
    }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) {return <LoginRequired/>}

    return (
        <div id="Units">
            <div id='header'>
                <h1>Units</h1>
                <p>Here's your progress so far.</p>
            </div>
            <div id="list">
                {Units.map((x) => {return <Button data={x} key={x.unitid}/>})}
            </div>
        </div>
        
    )
}