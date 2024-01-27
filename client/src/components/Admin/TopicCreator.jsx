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


export function TopicCreator(p) {
    const [Data, SetData] = useState({});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowUnits, SetShowUnits] = useState(false);
    const units = Object.keys(p.GlobalData)

    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Unit:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowUnits(!ShowUnits)}>{(Data.unit) || "None"}</button>
                        {ShowUnits && <div id='select' onMouseLeave={()=>SetShowUnits(false)}>
                            <div id='select-scroll'>
                                {units.map((u,i) => {return (
                                    <div key={i} className={u==Data.unit ? 'chosen' : ''} onClick={()=>{SetShowUnits(!ShowUnits); SetData({...Data, unit:u})}}>{u}</div>
                                )})}
                            </div>
                        </div>}
                    </div>
                </div>
                <div id='field'>
                    <label>Topic Name:</label>
                    <input className='input' placeholder='Animals' onChange={(e)=>{SetData({...Data, topic:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Topic <a href="https://react-icons.github.io/react-icons/icons/fa/">Icon:</a></label>
                    <input className='input' placeholder='pen' onChange={(e) => { SetData({ ...Data, icon: e.target.value }) }} />
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+Data.icon}></i></span>
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