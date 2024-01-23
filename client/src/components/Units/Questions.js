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
    const correct = []
    const incorrect = []

    for (let i = 0; i < Object.keys(checkedstate).length; i++) {
        if (checkedstate[i].selected.sort().toString() == checkedstate[i].correct_answers.sort().toString()) { // correct
            correct.push(checkedstate[i].question_id)
            DispatchQuestionsData({type:'SETASCORRECT', i})
        } else {
            incorrect.push(checkedstate[i].question_id)
            console.log(checkedstate[i].content)
        }
    }

    console.log('correct',correct.length)
    console.log('incorrect',incorrect.length)
    const percentage = Math.round((correct.length / (correct.length+incorrect.length)) * 100)

    return {correct, incorrect, percentage}
}


const QuestionsReducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            const newstate = {...state}
            newstate[action.i] = {selected:[], answer_options:action.answer_options, correct:false, correct_answers:action.correct_answers, question_id: action.question_id}
            return newstate
        case "UPDATESELECTED":
            const updatedstate = {...state}
            updatedstate[action.i].selected = action.selected
            return updatedstate
        
        case "SETASCORRECT":
            const correctstate = { ...state }
            correctstate[action.i].correct = true
            return correctstate
        
        case "UPDATEPERCENTAGE":
            return {...state, percentage:action.percentage}
        
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
                    {p.i + 1}. {p.data.content}
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


export function Questions() {
    document.title = `VocaPlace | Questions`

    const { unitid, topicid } = useParams()
    const C = useContext(AppContext);
    const [Questions, SetQuestions] = useState([]);
    const [Finished, SetFinished] = useState(false);
    const [QuestionsData, DispatchQuestionsData] = useReducer(QuestionsReducer, {})

    useEffect(() => {
        if (C.AppReady) {
            DataService.GenerateQuiz(unitid,topicid).then((data) => {
                console.log('answeredquestions',data.data.answeredQuestions)
                console.log('unansweredquestions', data.data.unansweredQuestions)
                const questions = ShuffleArray(data.data.unansweredQuestions.concat(data.data.answeredQuestions))

                questions.forEach((q, i) => {
                    const answer_options = ShuffleArray(questions[i].correct_answers.concat(questions[i].misleading_answers))
                    DispatchQuestionsData({ type: 'INIT', i, answer_options, correct_answers:questions[i].correct_answers, question_id:questions[i].question_id })
                })
                SetQuestions(questions)
            })
        }
    }, [C.AppReady])


    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Questions">
            <div id='header'>
                <h1>Questions</h1>
                <p>Here's your set of questions. Good luck!</p>
            </div>
            {Finished && (
            <div id="result">
                <h2>Your result is {QuestionsData.percentage}%</h2>
                {QuestionsData.percentage < 50 && (
                    <p>Looks like you still need more practice.</p>
                )}
                {QuestionsData.percentage >= 50 && (
                    <p>Well done!</p>
                )}
                <Link to='/units' className='hovertext'>Return to Units</Link>
            </div>
            )}
            <div id="questions">
                {Questions.map((x,i) => { 
                    return <Question data={x} key={x.question_id} i={i} QuestionsData={QuestionsData} DispatchQuestionsData={DispatchQuestionsData} Finished={Finished}/> 
                })}
            </div>
            {!Finished && ( 
                <button id="submitbutton" className="button" onClick={() => { 
                    // DispatchQuestionsData({ type: "CHECK" })
                    const result = CheckQuestions(QuestionsData, DispatchQuestionsData)
                    DispatchQuestionsData({ type: "UPDATEPERCENTAGE", percentage:result.percentage})
                    
                    console.log('correctquestions',result.correct)
                    // const incorrect = Object.values(QuestionsData).slice(0,-1).filter(x => !x.correct).map(x => x.question_id)
                    // console.log(incorrect)
                    if (result.correct.length > 0) {
                        DataService.SaveQuestionsAnswered(result.correct).then(()=>{
                            console.log('saved')
                        })
                    }
                    SetFinished(true)
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }}>Submit Answers</button>
            )}
        </div>
    )
}