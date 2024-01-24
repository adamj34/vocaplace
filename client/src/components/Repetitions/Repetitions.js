import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import DataService from "../../DataService";

export function Repetitions() {
    document.title = `VocaPlace | Repetitions`

    const C = useContext(AppContext);
    const [Repetitions, SetRepetitions] = useState([]);

    const data = {
        'Vocabulary' : {
            unit_icon: 'book',
            topics: {
                'Animals': 1,
                'Plants': 2
            }
        },
        'Grammar' : {
            unit_icon: 'book',
            topics: {
                'Idioms': 5,
                'Past Simple': 3
            }
        }
    }

    // useEffect(() => {
    //     if (C.AppReady) {
    //         DataService.GetRepetitions().then((data) => {
    //             console.log(data)
    //             // console.log('unansweredquestions', data.data.unansweredQuestions)
    //             // const questions = ShuffleArray(data.data.unansweredQuestions.concat(data.data.answeredQuestions))

    //             // questions.forEach((q, i) => {
    //             //     const answer_options = ShuffleArray(questions[i].correct_answers.concat(questions[i].misleading_answers))
    //             //     DispatchQuestionsData({ type: 'INIT', i, answer_options, correct_answers: questions[i].correct_answers, question_id: questions[i].question_id })
    //             // })
    //             // SetQuestions(questions)
    //         })
    //     }
    // }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Repetitions">
            <div id='header'>
                <h1>Repetitions</h1>
                <p>Practice makes perfect.</p>
            </div>
            {Object.entries(data).map(([unit,data])=>{
                return (
                    <div id='unit' key='unit'>
                        <div id="subheader">
                            <i id='icon' className={"fa-solid fa-" + (data.unit_icon || "book")}></i>
                            <h3>{unit}</h3>
                        </div>
                        
                        <div id="topics">
                            {Object.entries(data.topics).map(([topic,count])=>{
                                return (
                                    <li>{topic}: {count} mistake{count>1 && 's'}</li>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            <button className="button">Generate Repetition</button>
        </div>
        
    )
}