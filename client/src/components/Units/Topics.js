import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { FaBook, FaComments, FaSpellCheck, FaFlag } from 'react-icons/fa';
import { Link } from "react-router-dom";


const IconMapping = {'Animals':FaBook, 'Plants':FaComments, 'Food':FaSpellCheck, 'Furniture':FaFlag}

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

export function Topics() {
    const { keycloak } = useKeycloak();
    
    if (!keycloak.authenticated) {return <LoginRequired/>}

    const unitname = 'unitname'
    document.title = `VocaPlace | ${unitname}`
    const units = [{id:'1', name:'Animals', completion:'38'}, {id:'2', name:'Plants', completion:'58'}, {id:'3', name:'Food', completion:'1'}, {id:'4', name:'Furniture', completion:'0'}]

    return (
        <div id="Topics">
            <div id='header'>
                <h1>{unitname}</h1>
                <p>Choose a topic to generate a quiz.</p>
            </div>
            <div id="list">
                {units.map((x) => {return <Button data={x} key={x.id}/>})}
            </div>
        </div>
        
    )
}