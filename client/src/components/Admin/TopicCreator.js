import { useState } from "react";
import DataService from "../../DataService";


function Validate(Data, units) {
    if (!Data.topic || Data.unit.topic < 5) {
        return "Topic name must be at least 5 characters long!"
    } else if (Object.values(units).map(x => x.unit.toLowerCase()).includes(Data.unit.toLowerCase())) {
        return "This unit already exists!"
    }
}


export function TopicCreator(p) {
    const [Data, SetData] = useState({});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowUnits, SetShowUnits] = useState(false);

    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Topic Name:</label>
                    <input className='input' placeholder='Animals' onChange={(e)=>{SetData({...Data, topic:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Topic <a href="https://react-icons.github.io/react-icons/icons/fa/">Icon:</a></label>
                    <input className='input' placeholder='pen' onChange={(e) => { SetData({ ...Data, icon: e.target.value }) }} />
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+Data.icon}></i></span>
                </div>
                <div id='field'>
                    <label>Unit:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowUnits(!ShowUnits)}>{(Data.unit) || "None"}</button>
                        {ShowUnits && <div id='select' onMouseLeave={()=>SetShowUnits(false)}>
                            <div id='select-scroll'>
                                {p.units.map((u,i) => {return (
                                    <div key={i} className={u.unit==Data.unit ? 'chosen' : ''} onClick={()=>{SetShowUnits(!ShowUnits); SetData({...Data, unit:u.unit})}}>{u.unit}</div>
                                )})}
                            </div>
                        </div>}
                    </div>
                </div>

                <p id="error">{ErrorMessage}</p>

                <div id='buttons'>
                <button type='button' className='button' disabled={Submitting} onClick={()=>{
                    SetSubmitting(true)
                    const validationerror = Validate(Data, p.units)
                    if (validationerror) {
                        SetErrorMessage(validationerror)
                    } else {
                        SetErrorMessage("")

                        DataService.AddUnit(Data).then(()=>{
                            SetSubmitting(false)
                            SetErrorMessage("Unit created!")
                        }).catch(()=>{
                            SetErrorMessage("Failed to submit!")
                            SetSubmitting(false)
                        })
                    }
                }}>Submit</button>
            </div>
        </form>
    </div>
    )
}