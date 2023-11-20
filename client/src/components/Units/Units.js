import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { FaBook, FaComments, FaSpellCheck, FaFlag } from 'react-icons/fa';
import { Link } from "react-router-dom";


const IconMapping = {'Basic Vocabulary':FaBook, 'Conversation':FaComments, 'Grammar':FaSpellCheck, 'Culture':FaFlag}

function Button(p) {
    const Icon = IconMapping[p.data.name] || FaBook
    return (
        <div id='button'>
            <Link to={p.data.id}>
                <div id='title' className="hovertext">
                    <Icon id='icon'/>
                    <p>{p.data.name}</p>
                </div>
            </Link>
            <ProgressBar completion={p.data.completion}/>
        </div>
    )
}

function ProgressBarRoundFunction(n) {
    if (n == 0) {
        return n
    } else {
        return Math.max(n,5)
    }
}
function ProgressBar(p) {
    return (
        <div id='ProgressBar'>
            <div id='container'>
                <div id='bar' style={{width:`${ProgressBarRoundFunction(p.completion)}%`}}>
                    <p>{p.completion}% Completed</p>
                </div>
            </div>
        </div>
    )
}

export function Units() {
    document.title = `VocaPlace | Units`
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) {return <LoginRequired/>}

    const units = [{id:'1', name:'Basic Vocabulary', completion:'38'}, {id:'2', name:'Grammar', completion:'58'}, {id:'3', name:'Conversation', completion:'1'}, {id:'4', name:'Culture', completion:'0'}]

    return (
        <div id="Units">
            <div id='header'>
                <h1>Units</h1>
                <p>Here's your progress so far.</p>
            </div>
            <div id="list">
                {units.map((x) => {return <Button data={x} key={x.id}/>})}
            </div>
        </div>
        
    )
}