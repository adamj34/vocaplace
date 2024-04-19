import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { UnitCreator } from './UnitCreator'
import { TopicCreator } from './TopicCreator';
import { QuestionCreator } from './QuestionCreator';


export function Admin() {
    document.title = `VocaPlace | Admin`
   
    const C = useContext(AppContext)
    const [GlobalData, SetGlobalData] = useState({})
    const [NeedToUpdateData, SetNeedToUpdateData] = useState(true) // for creators
    const [ShowManageQuestions, SetShowManageQuestions] = useState(false)
    const [ShowCreate, SetShowCreate] = useState(false)
    const [Managed, SetManaged] = useState({})
    const [Created, SetCreated] = useState({})

    useEffect(() => {
        if (C.AppReady && NeedToUpdateData) {
            DataService.GetUnitsTopicsQuestions().then((data) => {
                const formatted = Object.fromEntries(Object.entries(data.data).map(([i, d]) => [d.unit, {topics:d.topics, unit_icon:d.unit_icon}]))
                SetGlobalData(formatted)
                SetNeedToUpdateData(false)
            })

        }
    }, [C.AppReady, NeedToUpdateData])

    return (
        <div id='Admin'>
             <div id='header'>
                <h1>Admin Panel</h1>
                <p>Manage questions, users and groups.</p>
            </div>

            <div id='create'>
                <div id='subheader'>
                    <h3>Add new:</h3>
                    <div id='selectcreated'>
                        <button className='selectbutton' onClick={()=>SetShowCreate(!ShowCreate)}>{Created.type || "None"}</button>
                        {ShowCreate && <div id='select' onMouseLeave={()=>SetShowCreate(false)}>
                            <div id='select-scroll'>
                                {['unit', 'topic', 'question'].map((v,i) => {return (
                                    <p id='pick' key={i} className={v === Created.type ? 'chosen' : ''} onClick={()=>{SetShowCreate(!ShowCreate); SetCreated({type:v})}}>{v}</p>
                                )})}
                            </div>
                        </div>}
                    </div>
                </div>


                {Created.type === 'unit' && <UnitCreator GlobalData={GlobalData} SetNeedToUpdateData={SetNeedToUpdateData}/>}
                {Created.type === 'topic' && <TopicCreator GlobalData={GlobalData} SetNeedToUpdateData={SetNeedToUpdateData} />}
                {Created.type === 'question' && <QuestionCreator GlobalData={GlobalData} SetNeedToUpdateData={SetNeedToUpdateData} />}
            </div>
            
        </div>
    )
}