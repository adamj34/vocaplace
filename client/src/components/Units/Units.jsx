import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { Link } from "react-router-dom";
import DataService from "../../DataService";
import { useContext } from "react";
import { AppContext } from '../../App';
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Icon from "../Icon";


function Button({ data }) {
    return (
        <div id='button'>
            <Link to={data.unitid}>
                <div id='title' className="hovertext">
                    <Icon icon={data.unit_icon || 'book'} />
                    <p>{data.unit}</p>
                </div>
            </Link>
            <ProgressBar completion={parseFloat(data.completion_ratio) * 100} />
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