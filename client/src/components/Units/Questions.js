import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { FaStar, FaLightbulb } from 'react-icons/fa';


function Question(p) {
    const answers = p.data.correct_answers.concat(p.data.misleading_answers)
    const stars = Array.from({ length: p.data.difficulty}, (_,i) => i + 1)
    let selected = []
    p.UpdateQuestion(p.count, {selected}, )
    
    return (
        <div id="question">
            <div id="title">
                <div id="left">
                    {p.count + 1}. {p.data.content}
                </div>
                <div id="right">
                    {stars.map((i) => (
                        <FaStar key={i} id='icon' />
                    ))}
                </div>
                
            </div>
            <div id="answers">
                {p.data.question_type == 'pick' &&
                <div id="pick">
                    {answers.map((q)=> {
                        return (
                            <button className="button" id={selected.includes(q) && 'selected'}
                            onClick={()=>{
                                if (selected.includes(q)) {
                                    selected = selected.filter(x => x != q)
                                } else {
                                    selected.push(q)
                                }
                                p.UpdateQuestion(p.count, { selected })
                               

                            }}
                            >{q}</button>
                        )
                    })}
                    {/* <FaLightbulb id='icon' /> */}
                </div>
                }
            </div>
        </div>
    )
}


export function Questions() {
    document.title = `VocaPlace | Questions`

    const C = useContext(AppContext);
    const [Questions, SetQuestions] = useState({unansweredQuestions:[], answeredQuestions:[]});
    const [QuizData, SetQuizData] = useState({});
    const { unitid, topicid } = useParams()

    function UpdateQuestion(questionid, questiondata) {
        const newdata = QuizData
        QuizData[questionid] = questiondata
        SetQuizData(newdata)
        console.log(QuizData)
    }

    useEffect(() => {
        if (C.AppReady) {
            DataService.GenerateQuiz(unitid,topicid).then((data) => {
                console.log(data)
                SetQuestions(data.data)
                // const formatted = Object.entries(data.data).map(([topicid, d]) => {
                //     return { topicid, ...d }
                // })
                // SetTopicsData(formatted)
                // SetUnitName(data.unit)
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
            <div id="questions">
                {Questions.unansweredQuestions.map((x,i) => { return <Question data={x} key={x.question_id} count={i} QuizData={QuizData} UpdateQuestion={UpdateQuestion} /> })}
            </div>
            <button id="submitbutton" className="button">Submit Answers</button>
        </div>
    )
}