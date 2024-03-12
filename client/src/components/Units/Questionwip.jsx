import { useState } from "react"
import Icon from "../Icon"


export function Question({ q, SetCorrectQuestions, finished }) {

    const [Correct, SetCorrect] = useState(false);
    const [SelectedAnswers, SetSelectedAnswers] = useState([]);

    function SelectAnswer(answer) {
        if (!finished) {
            SetSelectedAnswers(selected => {
                const updated_selected = selected.includes(answer) ? selected.filter(x => x !== answer) : [...selected, answer]

                if (updated_selected.sort().toString() === q.correct_answers.sort().toString()) {
                    SetCorrect(true)
                    SetCorrectQuestions(prev => {
                        const updatedQuestions = [...prev]
                        updatedQuestions[q.index] = true
                        return updatedQuestions
                    })
                } else {
                    SetCorrect(false)
                    SetCorrectQuestions(prev => {
                        const updatedQuestions = [...prev]
                        updatedQuestions[q.index] = false
                        return updatedQuestions
                    })
                }

                return updated_selected
            })
        }
    }

    return <div id="question">
        <div id="title">
            <div id="left">
                {q.index + 1 + '. '}
                {q.question_type == 'pick' && q.content} 
                {q.question_type == 'fill' && ('Fill in the gap to make a sentence: ' + q.content.replace('_', '__________'))} 
                {q.question_type == 'order' && ('Put the words in the correct order to translate: ' + q.content)}
            </div>
            <div id="right">
                {!finished ?
                    Array.from({length:q.difficulty}).map((_,i) => (
                        <Icon icon='star' key={i}/>
                    )) : 
                    Correct ? <Icon icon='check'/> : <Icon icon='x'/>
                }
            </div>
         </div>

        <div id="answers">

            {q.question_type == 'pick' && (<div id="pick">
                {q.all_answers.map((a,i)=> {
                    return (
                        <button id='answer' key={i} className={`button ${SelectedAnswers.includes(a) ? 'selected' : ''}`} disabled={finished} onClick={()=>{SelectAnswer(a)}}>
                            {a}
                        </button>
                    )
                })}
            </div>)}
        </div>


    </div>
}