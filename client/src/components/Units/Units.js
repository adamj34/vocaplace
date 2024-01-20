import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { FaBook, FaComments, FaSpellCheck, FaFlag } from 'react-icons/fa';
import { Link } from "react-router-dom";
import DataService from "../../DataService";
import { useContext } from "react";
import { AppContext } from '../../App';
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";


const IconMapping = {'Book':FaBook, 'Comments':FaComments, 'SpellCheck':FaSpellCheck, 'Flag':FaFlag} // DO NAPRAWY (jak to ogarnac w bazie danych)

function Button(p) {
    const Icon = IconMapping[p.data.name] || FaBook
    return (
        <div id='button'>
            <Link to={p.data.unitid}>
                <div id='title' className="hovertext">
                    <Icon id='icon'/>
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
    const [UnitsData, SetUnitsData] = useState([]);
    
    useEffect(() => {
        if (C.AppReady) {
            DataService.GetUnitsProgress().then((data) => {
                const formatted = Object.entries(data.data).map(([unitid, d]) => {
                    return { unitid, ...d }
                })
                SetUnitsData(formatted)
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
                {UnitsData.map((x) => {return <Button data={x} key={x.unitid}/>})}
            </div>
        </div>
        
    )
}