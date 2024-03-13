import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { Link } from "react-router-dom";
import Icon from "../Icon";



export function Repetitions() {
    document.title = `VocaPlace | Repetitions`

    const C = useContext(AppContext);
    const [Repetitions, SetRepetitions] = useState([]);

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetRepetitions().then((data) => {
                const filtered = data.data.map(unit => {unit.topics = unit.topics.filter(t => t.repetition_questions > 0); return unit}).filter(unit => unit.topics.length > 0) // remove unnecessary units and topics
                SetRepetitions(filtered)
            })
        }
    }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Repetitions">
            <div id='header'>
                <h1>Repetitions</h1>
                <p>Practice makes perfect.</p>
            </div>
            {Repetitions.length > 0 ? (
            <div>
                {Repetitions.map((u,i)=>{
                    return (
                        <div id='unit' key={i}>
                            <div id="subheader">
                                <Icon icon={u.unit_icon || 'book'}/>
                                <p>{u.unit}</p>
                            </div>
                            
                            <div id="topics">
                                {u.topics.map((t,i)=>{
                                    return (
                                        <li key={i}>
                                            <Icon icon={t.topic_icon || 'feather'} />
                                            <p>{t.topic}: {t.repetition_questions} mistake{t.repetition_questions > 1 && 's'}</p>
                                        </li>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                <Link to={'./set'}><button className="button">Review Mistakes</button></Link>
            </div>) : 
            <h3>You have reviewed all your mistakes :)</h3>
            }
        </div>
        
    )
}