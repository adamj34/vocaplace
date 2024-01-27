import { useState } from "react";
import DataService from "../../DataService";


function Validate(Data, GlobalData) {
    console.log(Data)
    const topics = Object.values(GlobalData).map(x => x.topics).flat().map(x => x.topic)
    if (!Data.topic || Data.topic.length < 5) {
        return "Topic name must be at least 5 characters long!"
    } else if (topics.map(x => x.toLowerCase()).includes(Data.topic.toLowerCase())) {
        return "This topic already exists!"
    } else if (!Data.unit) {
        return "You must choose a unit!"
    }
}


export function QuestionCreator(p) {
    const [Data, SetData] = useState({});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowTopics, SetShowTopics] = useState(false);
    const [ShowDifficulty, SetShowDifficulty] = useState(false);
    const [ShowType, SetShowType] = useState(false);
    const units = Object.keys(p.GlobalData)

    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Question Content:</label>
                    <input className='input' placeholder='Animals' onChange={(e)=>{SetData({...Data, topic:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Assign to Unit:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowTopics(!ShowTopics)}>{(Data.unit) || "None"}</button>
                        {ShowTopics && <div id='select' onMouseLeave={()=>SetShowTopics(false)}>
                            <div id='select-scroll'>
                                {units.map((u,i) => {return (
                                    <div key={i} className={u==Data.unit ? 'chosen' : ''} onClick={()=>{SetShowTopics(!ShowTopics); SetData({...Data, unit:u})}}>{u}</div>
                                )})}
                            </div>
                        </div>}
                    </div>
                </div>

                <div id='field'>
                    <label>Difficulty:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowDifficulty(!ShowDifficulty)}>{(Data.difficulty == 1 && 'Easy') || (Data.difficulty == 2 && 'Medium') || (Data.difficulty == 3 && 'Hard') || "None"}</button>
                        {ShowDifficulty && <div id='select' onMouseLeave={() => SetShowDifficulty(false)}>
                            <div id='select-scroll'>
                                {[1, 2, 3].map((d) => {
                                    return (<>
                                        <div className={d == Data.difficulty && 'chosen'} onClick={() => { SetShowDifficulty(false); SetData({ ...Data, difficulty: d, }) }}>{d == 1 && 'Easy'}{d == 2 && 'Medium'}{d == 3 && 'Hard'}</div>
                                    </>)
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                

                <p id="error">{ErrorMessage}</p>

                <div id='buttons'>
                    <button type='button' className='button' disabled={Submitting} onClick={() => {
                        SetSubmitting(true)
                        const validationerror = Validate(Data, p.GlobalData)
                        if (validationerror) {
                            SetErrorMessage(validationerror)
                        } else {
                            SetErrorMessage("")
                            DataService.AddTopic(Data).then(() => {
                                SetErrorMessage("Topic created!")
                                p.SetNeedToUpdateData(true)
                            }).catch(() => {
                                SetErrorMessage("Failed to submit!")
                            })
                        }
                        SetSubmitting(false)
                    }}>Submit</button>
            </div>
        </form>
    </div>
    )
}