import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect, useReducer } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { ShuffleArray } from "../../helpers/ShuffleArray";
import Icon from "../Icon";
import { Question } from "./Questionwip";

// function CheckQuestions(checkedstate, DispatchQuestionsData) {
//     const correctids = []
//     const incorrectids = []
//     let points = 0

//     for (let i = 0; i < Object.keys(checkedstate).length; i++) {
//         if (checkedstate[i].selected.sort().toString() == checkedstate[i].correct_answers.sort().toString()) { // correct
//             correctids.push(checkedstate[i].question_id)
//             points += checkedstate[i].difficulty * 10
//             DispatchQuestionsData({type:'SETASCORRECT', i})
//         } else {
//             incorrectids.push(checkedstate[i].question_id)
//         }
//     }
//     const percentage = Math.round((correctids.length / (correctids.length+incorrectids.length)) * 100)

//     return {correctids, incorrectids, percentage, points}
// }


// const QuestionsReducer = (state, action) => {
//     switch (action.type) {
//         case "INIT":
//             const newstate = {...state}
//             newstate[action.i] = {selected:[], answer_options:action.answer_options,difficulty:action.difficulty, correct:false, correct_answers:action.correct_answers, question_id: action.question_id}
//             return newstate
//         case "UPDATESELECTED":
//             const updatedstate = {...state}
//             updatedstate[action.i].selected = action.selected
//             return updatedstate
        
//         case "SETASCORRECT":
//             const correctstate = { ...state }
//             correctstate[action.i].correct = true
//             return correctstate
        
//         case "UPDATEPERCENTAGEANDPOINTS":
//             return {...state, percentage:action.percentage, points:action.points}
        
//         default:
//             return state;
//     }
// }


// function Question({ data, i, QuestionsData, DispatchQuestionsData, Finished }) {
//     const stars = Array.from({ length: data.difficulty }, (_,i) => i + 1)

//     return (
//         <div id="question">
//             <div id="title">
//                 <div id="left">
//                     {i + 1}. {data.question_type == 'pick' && data.content} {data.question_type == 'fill' && ('Fill in the gap to make a sentence: ' + data.content.replace('_', '__________'))} {data.question_type == 'order' && data.content}
//                 </div>
//                 <div id="right">
//                     {!Finished ? 
//                     stars.map((i) => (
//                         <Icon icon='star' key={i}/>
//                     )) : 
//                         QuestionsData[i].correct ? 
//                         <Icon icon='check'/>
//                         : <Icon icon='x'/>
//                     }
//                 </div>
//             </div>
//             <div id="answers">

//                 {data.question_type == 'pick' && (<div id="pick">
//                     {QuestionsData[i].answer_options.map((q,i)=> {
//                         return (
//                             <div id='answer' key={i} 
//                                 className={`${QuestionsData[i].selected.includes(q) ? 'selected' : ''} ${Finished ? 'disabled' : '' }`}
//                                 onClick={()=>{
//                                     if (!Finished) {
//                                         let selected = QuestionsData[i].selected
//                                         if (selected.includes(q)) {
//                                             selected = selected.filter(x => x != q)
//                                         } else {
//                                             selected.push(q)
//                                         }
//                                         DispatchQuestionsData({ type: 'UPDATESELECTED', i: i, selected })
//                                     }
//                                 }}>
//                                 {q}
//                             </div>
//                         )
//                     })}
//                 </div>)}

//                 {data.question_type == 'order' && (<div id="order">
//                     {QuestionsData[i].answer_options.map((q, i) => {
//                         return (
//                             <div id='answer' key={i}
//                                 className={`${QuestionsData[i].selected.includes(q) ? 'selected' : ''} ${Finished ? 'disabled' : ''}`}
//                                 onClick={() => {
//                                     if (!Finished) {
//                                         let selected = QuestionsData[i].selected
//                                         if (selected.includes(q)) {
//                                             selected = selected.filter(x => x != q)
//                                         } else {
//                                             selected.push(q)
//                                         }
//                                         DispatchQuestionsData({ type: 'UPDATESELECTED', i: i, selected })
//                                     }
//                                 }}>
//                                 {q}
//                             </div>
//                         )
//                     })}
//                 </div>)}

//                 {data.question_type == 'fill' && (<div id="fill">
//                     <input className='input' placeholder='Enter your answer.' />
//                 </div>)}

//             </div>
//             {(Finished && !QuestionsData[i].correct) && (
//                 <div id="correctanswers">
//                     <p>Correct answers:</p>
//                     {data.correct_answers.map((x, i) => {
//                         return <li key={i}>
//                             {x}
//                         </li>
//                     })}
//                 </div>
//             )}
//         </div>
//     )
// }


export function Questions({type}) {
    document.title = `VocaPlace | Questions`

    const { unitid, topicid } = useParams()
    const C = useContext(AppContext);
    const [Questions, SetQuestions] = useState([]);
    const [QuizFinished, SetQuizFinished] = useState(false);
    const [CorrectQuestions, SetCorrectQuestions] = useState([]);

    useEffect(() => {
        if (C.AppReady) {
            DataService.GenerateQuiz(type,unitid,topicid).then((data) => {
                const formatted = ShuffleArray(data.data)
                formatted.forEach((q, i) => {
                    q.all_answers = ShuffleArray(q.correct_answers.concat(q.misleading_answers))
                    q.index = i
                })
                SetQuestions(formatted)
                SetCorrectQuestions(Array(formatted.length).fill(false))
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load questions due to an unknown error.")
            })
        }
    }, [C.AppReady])

    return (
        <div id="Questions">
            <div id='header'>
                <h1>{type === 'normal' ? 'Questions' : 'Repetition'}</h1>
                <p>Here's your set of {type === 'repetition' && 'previously incorrect'} questions. Good luck!</p>
            </div>


            {/* {Finished && (
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
            )}*/}
            
            <div id="questions">
                {Questions.map((q,i) => { 
                    return <Question key={i} q={q} SetCorrectQuestions={SetCorrectQuestions} finished={QuizFinished} />
                })}
            </div>
            {/* {!Finished && ( 
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
                    if (result.incorrectids.length > 0 && type != 'repetition') {
                        DataService.SaveRepetitions(result.incorrectids).then(() => {
                            console.log('saved repetitions')
                        })
                    }
                    SetFinished(true)
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }}>Submit Answers</button>
            )}  */}
        </div>
    )
}