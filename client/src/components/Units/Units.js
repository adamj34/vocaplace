import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { FaBook, FaComments, FaSpellCheck, FaFlag } from 'react-icons/fa';


const IconMapping = {'Basic Vocabulary':FaBook, 'Conversation':FaComments, 'Grammar':FaSpellCheck, 'Culture':FaFlag}

function UnitButton(p) {
    const Icon = IconMapping[p.data.name] || FaBook
    return (
        <div id='unitbutton'>
            <div id='title'>
                <Icon id='icon'/>
                <p>{p.data.name}</p>
            </div>
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
    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) {return <LoginRequired/>}

    const units = [{name:'Basic Vocabulary', completion:'30'}, {name:'Grammar', completion:'58'}, {name:'Conversation', completion:'1'}, {name:'Culture', completion:'0'}]

    return (
        <div id="Units">
            <h1>Choose a Unit</h1>
            <div id="unitlist">
                {units.map((x) => {return <UnitButton data={x}/>})}
            </div>
        </div>
        
    )
}