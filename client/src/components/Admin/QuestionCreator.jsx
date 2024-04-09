import { useState } from "react";
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";
import { ValidateQuestion } from './ValidateQuestion.ts';


export function QuestionCreator(p) {
    const [Data, SetData] = useState({correctAnswers:[""], misleadingAnswers:[""]}); // one empty answer by default 
    const [Submitting, SetSubmitting] = useState(false);
    const [ShowTopics, SetShowTopics] = useState(false);
    const [ShowDifficulty, SetShowDifficulty] = useState(false);
    const [ShowType, SetShowType] = useState(false);
    const popup = usePopup()

    async function CreateQuestion() {
        try {
            SetSubmitting(true)
            const validation_error = ValidateQuestion(Data, p.GlobalData);
            if (validation_error) {
                popup("Error", validation_error);
                return;
            }
            await DataService.AddQuestion(Data);
            p.SetNeedToUpdateData(true);
            popup("Success", "Question created!");
        } catch (e) {
            console.error(e)
            popup("Error", "Failed to create new question due to an unknown error.");
        } finally {
            SetSubmitting(false);
        }
    }

    return (
        <div id='creator'>
            <form>
                
                <div id='field'>
                    <label>Unit and Topic:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowTopics(!ShowTopics)}>{Data.unit || "None"}{Data.topic && Data.unit && " | "}{(Data.topic) || ""}</button>
                        {ShowTopics && <div id='select' onMouseLeave={() => SetShowTopics(true)}>
                            <div id='select-scroll'>
                                {Object.entries(p.GlobalData).map(([u,data],i) => { // to trzeba jakos opakowac w diva
                                    return data.topics.length > 0 ?
                                    (<div key={i}>
                                        <p id='unit' className='disabled'>{u}</p>
                                        {data.topics.map((t, i) => {
                                            return (
                                                <p key={i} id='topic' className={(t.topic == Data.topic && u == Data.unit) ? 'chosen' : ''} onClick={() => { SetShowTopics(false); SetData({ ...Data, unit: u, topic: t.topic }) }}>{t.topic}</p>
                                            )
                                        })}
                                    </div>) : null
                                })}
                            </div>
                        </div>}
                    </div>
                </div>

                <div id='field'>
                    <label>Type:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowType(!ShowType)}>{(Data.questionType && Data.questionType.charAt(0).toUpperCase() + Data.questionType.slice(1)) || "None"}</button>
                        {ShowType && <div id='select' onMouseLeave={() => SetShowType(false)}>
                            <div id='select-scroll'>
                                {['Pick', 'Order', 'Fill'].map((t,i) => { // add 'Connect' later on
                                    return (
                                        <p key={i} className={t.toLowerCase() == Data.questionType ? 'chosen' : ''} onClick={() => { SetShowType(false); SetData({ ...Data, questionType: t.toLowerCase(), correctAnswers:[""], misleadingAnswers:[""] }) }}>{t}</p> // reset answer on type changed
                                    )
                                })}
                            </div>
                        </div>}
                    </div>
                </div>

                {Data.questionType && (<div id='field'>
                    <label>Question:</label>
                    <input className='input' placeholder={(Data.questionType == 'connect' && "Connect the words with their meaning in English.") || (Data.questionType == 'order' && "Ona ma psa.") || (Data.questionType == 'pick' && "Which of these are vehicles?") || (Data.questionType == 'fill' && 'The dog quickly _ the thief who tried to enter the house.') || ""} onChange={(e) => { SetData({ ...Data, content: e.target.value }) }} />
                </div>)}

                {(Data.questionType == 'pick' || Data.questionType == 'fill') && (<div id='field'>
                    <label>Correct Answers:</label>
                    <div id="answers">
                        <div id="inputs">
                            {Data.correctAnswers.map((x, i) => {
                                return (
                                    <div id="inputbox" key={i}>
                                        <input className='input' value={x} placeholder={'Option ' + (i + 1)} onChange={(e) => { const newcorrect = [...Data.correctAnswers]; newcorrect[i] = e.target.value; SetData({ ...Data, correctAnswers: newcorrect }) }} />
                                        {Data.correctAnswers.length > 1 && <i id='iconbutton' className="fas fa-xmark" onClick={(e) => { SetData({ ...Data, correctAnswers: Data.correctAnswers.filter((_, i2) => i2 !== i) }) }} />}
                                    </div>
                                )
                            })}
                        </div>
                        {Data.correctAnswers.length < 5 && <i id='iconbutton' className="fas fa-plus" onClick={(e) => { SetData({ ...Data, correctAnswers: [...Data.correctAnswers, ""] }) }} />}
                    </div>
                </div>)}

                {Data.questionType == 'order' && (<div id='field'>
                    <label>Correct Answer:</label>
                    <input className='input' placeholder='She has a dog.' onChange={(e) => { SetData({ ...Data, correctAnswers: e.target.value.split(' ') }) }} />
                </div>)}

                {(Data.questionType == 'pick' || Data.questionType == 'order') && (<div id='field'>
                    <label>Misleading Answers:</label>
                    <div id="answers">
                        <div id="inputs">
                            {Data.misleadingAnswers.map((x, i) => {
                                return (
                                    <div id="inputbox" key={i}>
                                        <input className='input' value={x} placeholder={'Option ' + (i + 1)} onChange={(e) => { const newcorrect = [...Data.misleadingAnswers]; newcorrect[i] = e.target.value; SetData({ ...Data, misleadingAnswers: newcorrect }) }} />
                                        {Data.misleadingAnswers.length > 1 && <i id='iconbutton' className="fas fa-xmark" onClick={(e) => { SetData({ ...Data, misleadingAnswers: Data.misleadingAnswers.filter((_, i2) => i2 !== i) }) }} />}
                                    </div>
                                )
                            })}
                        </div>
                        {Data.misleadingAnswers.length < 5 && <i id='iconbutton' className="fas fa-plus" onClick={(e) => { SetData({ ...Data, misleadingAnswers: [...Data.misleadingAnswers, ""] }) }} />}
                    </div>
                </div>)}

                <div id='field'>
                    <label>Difficulty:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={() => SetShowDifficulty(!ShowDifficulty)}>{(Data.difficulty == 1 && 'Easy') || (Data.difficulty == 2 && 'Medium') || (Data.difficulty == 3 && 'Hard') || "None"}</button>
                        {ShowDifficulty && <div id='select' onMouseLeave={() => SetShowDifficulty(false)}>
                            <div id='select-scroll'>
                                {[1, 2, 3].map((d,i) => {
                                    return (
                                        <p key={i} className={d == Data.difficulty ? 'chosen' : ''} onClick={() => { SetShowDifficulty(false); SetData({ ...Data, difficulty: d, }) }}>{d == 1 && 'Easy'}{d == 2 && 'Medium'}{d == 3 && 'Hard'}</p>
                                    )
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                
                <div id='buttons'>
                    <button type='button' className='button' disabled={Submitting} onClick={CreateQuestion}>Submit</button>
            </div>
        </form>
    </div>
    )
}