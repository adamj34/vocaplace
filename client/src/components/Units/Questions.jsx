import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect, useReducer } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { FaStar, FaCheck } from 'react-icons/fa';
import { FaXmark } from "react-icons/fa6";
import { ShuffleArray } from "../../helpers/ShuffleArray";

function CheckQuestions(checkedstate, DispatchQuestionsData) {
    const correctids = []
    const incorrectids = []
    let points = 0

    for (let i = 0; i < Object.keys(checkedstate).length; i++) {
        if (checkedstate[i].selected.sort().toString() == checkedstate[i].correct_answers.sort().toString()) { // correct
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
            newstate[action.i] = {selected:[], answer_options:action.answer_options,difficulty:action.difficulty, correct:false, correct_answers:action.correct_answers, question_id: action.question_id}
            return newstate
        case "UPDATESELECTED":
            const updatedstate = {...state}
            updatedstate[action.i].selected = action.selected
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
    console.log(p.data)

    return (
        <div id="question">
            <div id="title">
                <div id="left">
                    {p.i + 1}. {p.data.question_type == 'pick' && p.data.content} {p.data.question_type == 'fill' && ('Fill in the gap to make a sentence: ' + p.data.content.replace('_', '_____'))} {p.data.question_type == 'order' && p.data.content}
                </div>
                <div id="right">
                    {!p.Finished ? 
                    stars.map((i) => (
                        <FaStar key={i} id='icon' />
                    )) : 
                        p.QuestionsData[p.i].correct ? 
                        <FaCheck id='icon' />
                        : <FaXmark id='icon' className="wrong" />
                    }
                </div>
            </div>
            <div id="answers">

                {p.data.question_type == 'pick' && (<div id="pick">
                    {p.QuestionsData[p.i].answer_options.map((q,i)=> {
                        return (
                            <div id='answer' key={i} 
                                className={`${p.QuestionsData[p.i].selected.includes(q) ? 'selected' : ''} ${p.Finished ? 'disabled' : '' }`}
                                onClick={()=>{
                                    if (!p.Finished) {
                                        let selected = p.QuestionsData[p.i].selected
                                        if (selected.includes(q)) {
                                            selected = selected.filter(x => x != q)
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

                {p.data.question_type == 'order' && (<div id="order">
                    {p.QuestionsData[p.i].answer_options.map((q, i) => {
                        return (
                            <div id='answer' key={i}
                                className={`${p.QuestionsData[p.i].selected.includes(q) ? 'selected' : ''} ${p.Finished ? 'disabled' : ''}`}
                                onClick={() => {
                                    if (!p.Finished) {
                                        let selected = p.QuestionsData[p.i].selected
                                        if (selected.includes(q)) {
                                            selected = selected.filter(x => x != q)
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

                {p.data.question_type == 'fill' && (<div id="fill">
                    <input className='input' placeholder='Enter your answer.' />
                </div>)}

            </div>
            {(p.Finished && !p.QuestionsData[p.i].correct) && (
                <div id="correctanswers">
                    <p>Correct answers:</p>
                    {p.data.correct_answers.map((x, i) => {
                        return <li key={i}>
                            {x}
                        </li>
                    })}
                </div>
            )}
        </div>
    )
}


export function Questions(p) {
    document.title = `VocaPlace | Questions`

    const { unitid, topicid } = useParams()
    const C = useContext(AppContext);
    const [Questions, SetQuestions] = useState([]);
    const [Finished, SetFinished] = useState(false);
    const [QuestionsData, DispatchQuestionsData] = useReducer(QuestionsReducer, {})

    useEffect(() => {
        if (C.AppReady) {
            if (p.type == 'normal') {
                DataService.GenerateQuiz(unitid,topicid).then((data) => {
                    const questions = ShuffleArray(data.data.unansweredQuestions.concat(data.data.answeredQuestions))
                    questions.forEach((q, i) => {
                        const answer_options = ShuffleArray(questions[i].correct_answers.concat(questions[i].misleading_answers))
                        
                        DispatchQuestionsData({ type: 'INIT', i, answer_options,difficulty:questions[i].difficulty, correct_answers:questions[i].correct_answers, question_id:questions[i].question_id })
                    })
                    SetQuestions(questions)
                })
            } else if (p.type == 'repetition') {
                console.log('this is a repetition quiz')
                DataService.GenerateRepetitionQuiz().then((data) => {
                    const questions = ShuffleArray(data.data)
                    questions.forEach((q, i) => {
                        const answer_options = ShuffleArray(questions[i].correct_answers.concat(questions[i].misleading_answers))
                        DispatchQuestionsData({ type: 'INIT', i, answer_options,difficulty:questions[i].difficulty, correct_answers: questions[i].correct_answers, question_id: questions[i].question_id })
                    })
                    SetQuestions(questions)
                })
            }
        }
    }, [C.AppReady])


    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Questions">
            {p.type == 'normal' && (<div id='header'>
                <h1>Questions</h1>
                <p>Here's your set of questions. Good luck!</p>
            </div>)}
            {p.type == 'repetition' && (<div id='header'>
                <h1>Repetition</h1>
                <p>Here's your set of previously incorrect questions. Good luck!</p>
            </div>)}


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
                <button id="submitbutton" className="button" onClick={() => { 
                    const result = CheckQuestions(QuestionsData, DispatchQuestionsData)
                    DispatchQuestionsData({ type: "UPDATEPERCENTAGEANDPOINTS", percentage:result.percentage, points:result.points})
                    if (result.correctids.length > 0) {
                        DataService.SaveQuestionsAnswered(result.correctids).then(()=>{
                            console.log('saved answered')
                        })
                        DataService.UpdatePoints(result.points).then(() => {
                            console.log('updated points')
                        })

                    }
                    if (result.incorrectids.length > 0 && p.type != 'repetition') {
                        DataService.SaveRepetitions(result.incorrectids).then(() => {
                            console.log('saved repetitions')
                        })
                    }
                    SetFinished(true)
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }}>Submit Answers</button>
            )}
        </div>
    )
}