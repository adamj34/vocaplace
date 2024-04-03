import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import ProgressBar from "./ProgressBar";
import Icon from "../Icon";
import { usePopup } from "../Popup.tsx";


function Button({data}) {
    return (
        <div id='button'>
            <Link to={data.topicid}>
                <div id='title' className="hovertext">
                    <Icon icon={data.topic_icon || 'feather'}/>
                    <p>{data.topic}</p>
                </div>
            </Link>
            <ProgressBar completion={parseFloat(data.completion_ratio) * 100} />
        </div>
    )
}

export function Topics() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const C = useContext(AppContext);
    const [Topics, SetTopics] = useState([]);
    const [UnitName, SetUnitName] = useState('Units');
    const { unitid } = useParams()
    document.title = `VocaPlace | ${UnitName}`
    const popup = usePopup()
    const navigate = useNavigate()

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetTopics(unitid).then((res) => {
                if (res.unit) { // unit has questions
                    const formatted = Object.entries(res.data).map(([topicid, d]) => {
                        return { topicid, ...d }
                    })
                    SetTopics(formatted)
                    SetUnitName(res.unit)
                } else {
                    navigate('/units')
                    console.warn(`Unit with ID ${unitid} has no topics. Navigating to /units.`)
                }
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load topics due to an unknown error.")
            })
        }
    }, [C.AppReady, unitid])

    return (
        <div id="Topics">
            <div id='header'>
                <h1>{UnitName}</h1>
                <p>Choose a topic to generate a set of questions.</p>
            </div>
            <div id="list">
                {Topics.map((x) => {return <Button data={x} key={x.topicid}/>})}
            </div>
        </div>
        
    )
}