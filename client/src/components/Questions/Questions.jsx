import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect, useReducer } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { ShuffleArray } from "../../helpers/ShuffleArray";
import Icon from "../Icon";
import { usePopup } from "../Popup.tsx";

function CheckQuestions(checkedstate, DispatchQuestionsData) {
    const correctids = []
    const incorrectids = []
    let points = 0

    for (let i = 0; i < Object.keys(checkedstate).length; i++) {
        // console.log(checkedstate[i])
        if (
            (checkedstate[i].question_type === 'pick' && checkedstate[i].selected.sort().toString() === checkedstate[i].correct_answers.sort().toString()) ||
            (checkedstate[i].question_type === 'fill' && checkedstate[i].correct_answers.includes(checkedstate[i].selected[0])) ||
            (checkedstate[i].question_type === 'order' && checkedstate[i].selected.toString() === checkedstate[i].correct_answers.toString())
            ) {
            correctids.push(checkedstate[i].question_id)
            points += checkedstate[i].difficulty * 10
            DispatchQuestionsData({type:'SETASCORRECT', i})
        } else {
            incorrectids.push(checkedstate[i].question_id)
        }
    }
    const percentage = Math.round((correctids.length / (correctids.length+incorrectids.length)) * 100)

    return {correctids, incorrectids, percentage, points}
}


const QuestionsReducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            const newstate = {...state}
            newstate[action.i] = {selected:[], answer_options:action.answer_options,difficulty:action.difficulty, correct:false, correct_answers:action.correct_answers, question_id: action.question_id, question_type:action.question_type}
            return newstate
        case "UPDATESELECTED":
            const updatedstate = {...state}
            updatedstate[action.i].selected = action.selected
            // console.log(action.selected)
            return updatedstate
        
        case "SETASCORRECT":
            const correctstate = { ...state }
            correctstate[action.i].correct = true
            return correctstate
        
        case "UPDATEPERCENTAGEANDPOINTS":
            return {...state, percentage:action.percentage, points:action.points}
        
        default:
            return state;
    }
}


function Question(p) {
    const stars = Array.from({ length: p.data.difficulty }, (_,i) => i + 1)

    return (
        <div id="question">
            <div id="title">
                <div id="left">
                    {p.i + 1 + '. '}
                    {p.data.question_type === 'pick' && p.data.content}
                    {p.data.question_type === 'fill' && ('Fill the gap: ' + p.data.content.replace('_', '________'))}
                    {p.data.question_type === 'order' && ("Put the words in the correct order to translate: '" + p.data.content+"'")}
                </div>
                <div id="right">
                    {!p.Finished ? 
                    stars.map((i) => (
                        <Icon icon='star' key={i}/>
                    )) : 
                        p.QuestionsData[p.i].correct ? 
                        <Icon icon='check'/>
                        : <Icon icon='x'/>
                    }
                </div>
            </div>
            <div id="answers">

                {p.data.question_type === 'pick' && (<div id="pick">
                    {p.QuestionsData[p.i].answer_options.map((q,i)=> {
                        return (
                            <div id='answer' key={i} 
                                className={`${p.QuestionsData[p.i].selected.includes(q) ? 'selected' : ''} ${p.Finished ? 'disabled' : '' }`}
                                onClick={()=>{
                                    if (!p.Finished) {
                                        let selected = p.QuestionsData[p.i].selected
                                        if (selected.includes(q)) {
                                            selected = selected.filter(x => x !== q)
                                        } else {
                                            selected.push(q)
                                        }
                                        p.DispatchQuestionsData({ type: 'UPDATESELECTED', i: p.i, selected })
                                    }
                                }}>
                                {q}
                            </div>
                        )
                    })}
                </div>)}

                {p.data.question_type === 'order' && (<div id="order">
                    <div id="selected">
                        {p.QuestionsData[p.i].selected.map((q, i) => {
                            return (
                                <div id='answer' key={i}
                                    className={`selected ${p.Finished ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (!p.Finished) {
                                            let selected = p.QuestionsData[p.i].selected
                                            if (selected.includes(q)) {
                                                selected = selected.filter(x => x !== q)
                                            }
                                            p.DispatchQuestionsData({ type: 'UPDATESELECTED', i: p.i, selected })
                                        }
                                    }}>
                                    {q}
                                </div>
                            )
                        })}
                    </div>
                    <br/>
                    <div id="options">
                        {p.QuestionsData[p.i].answer_options.filter(x=>!p.QuestionsData[p.i].selected.includes(x)).map((q, i) => {
                            return (
                                <div id='answer' key={i}
                                    className={`${p.Finished ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (!p.Finished) {
                                            let selected = p.QuestionsData[p.i].selected
                                            if (!selected.includes(q)) {
                                                selected.push(q)
                                            }
                                            p.DispatchQuestionsData({ type: 'UPDATESELECTED', i: p.i, selected })
                                        }
                                    }}>
                                    {q}
                                </div>
                            )
                        })}
                    </div>
                </div>)}

                {p.data.question_type === 'fill' && (<div id="fill">
                    <input className='input' placeholder={!p.Finished ? 'Enter your answer.' : '' }
                        disabled={p.Finished}
                        onChange={(e) => {
                            p.DispatchQuestionsData({ type: 'UPDATESELECTED', i: p.i, selected:[e.target.value] })
                        }}/>
                </div>)}

            </div>
            {(p.Finished && !p.QuestionsData[p.i].correct) && (
                <div id="correctanswers">
                    {p.data.question_type === 'pick' && <>
                        <p>Correct answers:</p>
                        {p.data.correct_answers.map((x, i) => {
                            return <li key={i}>
                                {x}
                            </li>
                        })}
                    </>}
                    {p.data.question_type === 'order' && <>
                        <p>Correct answer:</p>
                        <li>{p.data.correct_answers.join(' ')}</li>
                    </>}
                    {p.data.question_type === 'fill' && <>
                        <p>Possible answers:</p>
                        {p.data.correct_answers.map((x, i) => {
                            return <li key={i}>
                                {x}
                            </li>
                        })}
                    </>}
                </div>
            )}
        </div>
    )
}


export function Questions({type}) {
    document.title = `VocaPlace | Questions`

    const { unitid, topicid } = useParams()
    const C = useContext(AppContext);
    const [Questions, SetQuestions] = useState([]);
    const [Finished, SetFinished] = useState(false);
    const [QuestionsData, DispatchQuestionsData] = useReducer(QuestionsReducer, {})
    const popup = usePopup()
    const navigate = useNavigate()

    useEffect(() => {
        if (C.AppReady) {
                DataService.GenerateQuiz(type, unitid, topicid).then((res) => {
                    if (res.data && ((type === 'normal' && res.data[0].question_id) || (type === 'repetition' && res.data.length > 0))) { // topic has no questions
                        const questions = ShuffleArray(res.data)
                        questions.forEach((q, i) => {
                            const answer_options = ShuffleArray(questions[i].correct_answers.concat(questions[i].misleading_answers))

                            DispatchQuestionsData({ type: 'INIT', i, answer_options, difficulty: questions[i].difficulty, correct_answers: questions[i].correct_answers, question_id: questions[i].question_id, question_type: questions[i].question_type })
                        })
                        SetQuestions(questions)
                    } else {
                        if (type === 'normal') {
                            navigate(`/units/${unitid}`)
                            console.warn(`Topic with ID ${topicid} has no questions. Navigating to /units/${unitid}.`)
                        } else if (type === 'repetition') {
                            navigate(`/repetitions`)
                            console.warn(`Repetition set has no questions. Navigating to /repetitions.`)
                        }
                        
                    }
                }).catch(e => {
                    console.error(e)
                    popup("Error", "Failed to load questions due to an unknown error.")
                })
        }
    }, [C.AppReady, type, unitid, topicid])

    return (
        <div id="Questions">
            <div id='header'>
                <h1>{type === 'normal' ? 'Questions' : 'Repetition'}</h1>
                <p>Here's your set of {type === 'repetition' && 'previously incorrect'} questions. Good luck!</p>
            </div>


            {Finished && (
            <div id="result">
                <h2>Your result is {QuestionsData.percentage}%</h2>
                <h3>You have earned {QuestionsData.points} points!</h3>
                {QuestionsData.percentage < 50 && (
                    <p>Looks like you still need more practice.</p>
                )}
                {QuestionsData.percentage >= 50 && (
                    <p>Well done!</p>
                )}
                <Link to='/units' className='hovertext'>Return to units</Link> or <Link to='/repetitions' className='hovertext'>review your mistakes</Link>.
            </div>
            )}
            <div id="questions">
                {Questions.map((x,i) => { 
                    return <Question data={x} key={x.question_id} i={i} QuestionsData={QuestionsData} DispatchQuestionsData={DispatchQuestionsData} Finished={Finished}/> 
                })}
            </div>
            {!Finished && ( 
                <button id="submitbutton" className="button" disabled={Finished} onClick={() => { 
                    const result = CheckQuestions(QuestionsData, DispatchQuestionsData)
                    DispatchQuestionsData({ type: "UPDATEPERCENTAGEANDPOINTS", percentage:result.percentage, points:result.points})
                    if (result.correctids.length > 0) {
                        DataService.SaveQuestionsAnswered(result.correctids).then(()=>{
                            // console.log('saved answered')
                        }).catch(e => {
                            console.error(e)
                            popup("Error", "Failed to save answers due to an unknown error.")
                        })
                        DataService.UpdatePoints(result.points).then(() => {
                            // console.log('updated points')
                        }).catch(e => {
                            console.error(e)
                            popup("Error", "Failed to update points due to an unknown error.")
                        })
                    }
                    if (result.incorrectids.length > 0 && type !== 'repetition') {
                        DataService.SaveRepetitions(result.incorrectids).then(() => {
                            // console.log('saved repetitions')
                        }).catch(e => {
                            popup("Error", "Failed to save repetitions due to an unknown error.")
                        })
                    }
                    SetFinished(true)
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }}>Submit Answers</button>
            )}
        </div>
    )
}