import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import ProgressBar from "./ProgressBar";


function Button(p) {
    return (
        <div id='button'>
            <Link to={p.data.topicid}>
                <div id='title' className="hovertext">
                    <i id='icon' className="fa-solid fa-book"></i>
                    <p>{p.data.topic}</p>
                </div>
            </Link>
            <ProgressBar completion={parseInt(p.data.completion_ratio)}/>
        </div>
    )
}



export function Topics() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const C = useContext(AppContext);
    const [Topics, SetTopics] = useState([]);
    const [UnitName, SetUnitName] = useState('');
    const { unitid } = useParams()

    document.title = `VocaPlace | ${UnitName}`

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetTopics(unitid).then((data) => {
                const formatted = Object.entries(data.data).map(([topicid, d]) => {
                    return { topicid, ...d }
                })
                SetTopics(formatted)
                SetUnitName(data.unit)
            })
        }
    }, [C.AppReady])


    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Topics">
            <div id='header'>
                <h1>{UnitName}</h1>
                <p>Choose a topic to generate a set of questions.</p>
            </div>
            <div id="list">
                {Topics.map((x) => {return <Button data={x} key={x.id}/>})}
            </div>
        </div>
        
    )
}