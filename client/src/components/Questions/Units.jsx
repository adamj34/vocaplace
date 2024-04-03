import { Link } from "react-router-dom";
import DataService from "../../DataService";
import { useContext } from "react";
import { AppContext } from '../../App';
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Icon from "../Icon";
import { usePopup } from "../Popup.tsx";


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
    window.scrollTo({top: 0, left: 0});
    const popup = usePopup()

    const C = useContext(AppContext);
    const [Units, SetUnits] = useState([]);
    
    useEffect(() => {
        if (C.AppReady) {
            DataService.GetUnits().then((res) => {
                const formatted = Object.entries(res.data).map(([unitid, d]) => {
                    return { unitid, ...d }
                })
                SetUnits(formatted)
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load units due to an unknown error.")
            })
        }
    }, [C.AppReady])

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