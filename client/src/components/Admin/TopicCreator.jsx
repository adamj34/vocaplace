import { useState } from "react";
import DataService from "../../DataService";
import { usePopup } from '../Popup.tsx';


function Validate(Data, GlobalData) {
    const topics = Object.values(GlobalData).map(x => x.topics).flat().map(x => x.topic)
    if (!Data.topic || Data.topic.length < 5 || Data.topic.length > 50) {
        return "Topic name must contain between 5 and 50 characters! Please enter a valid name."
    } else if (topics.map(x => x.toLowerCase()).includes(Data.topic.toLowerCase())) {
        return "Topic with that name already exists! Please choose another name!"
    } else if (!Data.unit) {
        return "You must choose a unit!"
    }
}


export function TopicCreator(p) {
    const [Data, SetData] = useState({});
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowUnits, SetShowUnits] = useState(false);
    const units = Object.keys(p.GlobalData)
    const popup = usePopup()

    async function CreateTopic() {
        try {
            SetSubmitting(true)
            const validation_error = Validate(Data, p.GlobalData);
            if (validation_error) {
                popup("Error", validation_error);
                return;
            }
            await DataService.AddTopic(Data);
            p.SetNeedToUpdateData(true);
            popup("Success", "Topic created!");
        } catch (e) {
            console.error(e)
            popup("Error", "Failed to create new topic due to an unknown error.");
        } finally {
            SetSubmitting(false);
        }
    }

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
                                    <p key={i} className={u === Data.unit ? 'chosen' : ''} onClick={()=>{SetShowUnits(!ShowUnits); SetData({...Data, unit:u})}}>{u}</p>
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
                    <label>Topic <a href="https://react-icons.github.io/react-icons/icons/fa/" className="hovertext">Icon:</a></label>
                    <input className='input' placeholder='pen' onChange={(e) => { SetData({ ...Data, icon: e.target.value }) }} />
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+(Data.icon || 'book')}></i></span>
                </div>

                <div id='buttons'>
                    <button type='button' className='button' disabled={Submitting} onClick={CreateTopic}>{!Submitting ? 'Submit' : 'Submitting'}</button>
            </div>
        </form>
    </div>
    )
}