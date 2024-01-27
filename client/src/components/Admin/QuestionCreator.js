import { useState } from "react";
import DataService from "../../DataService";


function Validate(Data, GlobalData) {
    console.log(Data)
    // const topics = Object.values(GlobalData).map(x => x.topics).flat().map(x => x.topic)
    // if (!Data.topic || Data.topic.length < 5) {
    //     return "Topic name must be at least 5 characters long!"
    // } else if (topics.map(x => x.toLowerCase()).includes(Data.topic.toLowerCase())) {
    //     return "This topic already exists!"
    // } else if (!Data.unit) {
    //     return "You must choose a unit!"
    // }
}


export function QuestionCreator(p) {
    const [Data, SetData] = useState({});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowTopics, SetShowTopics] = useState(false);
    const [ShowDifficulty, SetShowDifficulty] = useState(false);
    const [ShowType, SetShowType] = useState(false);

    return (
        <div id='creator'>
            <form>
                
                <div id='field'>
                    <label>Unit and Topic:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowTopics(!ShowTopics)}>{Data.unit || "None"}{Data.topic && Data.unit && " | "}{(Data.topic) || ""}</button>
                        {ShowTopics && <div id='select' onMouseLeave={() => SetShowTopics(false)}>
                            <div id='select-scroll'>
                                {Object.entries(p.GlobalData).map(([u,data],i) => { // opakuj to w diva i dodaj key={i} jak krystian odda cssa
                                    return (<> 
                                        <div id='topic' className='disabled'>{u}</div>
                                        {data.topics.map((t, i) => {
                                            return (
                                                <div key={i} id='question' className={(t.topic == Data.topic && u == Data.unit) ? 'chosen' : ''} onClick={() => { SetShowTopics(false); SetData({ ...Data, unit: u, topic: t.topic }) }}>{t.topic}</div>
                                            )
                                        })}
                                    </>)
                                })}
                            </div>
                        </div>}
                    </div>
                </div>

                <div id='field'>
                    <label>Type:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowType(!ShowType)}>{(Data.type && Data.type.charAt(0).toUpperCase() + Data.type.slice(1)) || "None"}</button>
                        {ShowType && <div id='select' onMouseLeave={() => SetShowType(false)}>
                            <div id='select-scroll'>
                                {['Pick', 'Order', 'Connect', 'Fill'].map((t,i) => {
                                    return (
                                        <div key={i} className={t.toLowerCase() == Data.type ? 'chosen' : ''} onClick={() => { SetShowType(false); SetData({ ...Data, type: t.toLowerCase(), }) }}>{t}</div>
                                    )
                                })}
                            </div>
                        </div>}
                    </div>
                </div>

                <div id='field'>
                    <label>Question:</label>
                    <input className='input' placeholder={(Data.type == 'connect' && "Connect the words with their meaning in English.") || (Data.type == 'order' && "Put the words in the correct order to translate: 'Ona ma psa.'") || (Data.type == 'pick' && "Which of these are vehicles?") || (Data.type == 'fill' && 'The dog quickly _ the thief who tried to enter the house.')} required onChange={(e) => { SetData({ ...Data, content: e.target.value }) }} />
                </div>

                <div id='field'>
                    <label>Correct Answers:</label>
                    <input className='input' placeholder='Vocabulary' onChange={(e) => { SetData({ ...Data, unit: e.target.value }) }} />
                </div>

                <div id='field'>
                    <label>Difficulty:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowDifficulty(!ShowDifficulty)}>{(Data.difficulty == 1 && 'Easy') || (Data.difficulty == 2 && 'Medium') || (Data.difficulty == 3 && 'Hard') || "None"}</button>
                        {ShowDifficulty && <div id='select' onMouseLeave={() => SetShowDifficulty(false)}>
                            <div id='select-scroll'>
                                {[1, 2, 3].map((d,i) => {
                                    return (
                                        <div key={i} className={d == Data.difficulty ? 'chosen' : ''} onClick={() => { SetShowDifficulty(false); SetData({ ...Data, difficulty: d, }) }}>{d == 1 && 'Easy'}{d == 2 && 'Medium'}{d == 3 && 'Hard'}</div>
                                    )
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
                            // DataService.AddTopic(Data).then(() => {
                            //     SetErrorMessage("Topic created!")
                            //     p.SetNeedToUpdateData(true)
                            // }).catch(() => {
                            //     SetErrorMessage("Failed to submit!")
                            // })
                        }
                        SetSubmitting(false)
                    }}>Submit</button>
            </div>
        </form>
    </div>
    )
}