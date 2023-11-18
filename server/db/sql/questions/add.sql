INSERT INTO questions(unit_id, polish_question_body, polish_possible_answers, polish_correct_answers,
                      english_question_body, english_possible_answers, english_correct_answers, difficulty)
VALUES(
    ${unitId},
    ${polishQuestionBody}, ${polishPossibleAnswers}, ${polishCorrectAnswers},
    ${englishQuestionBody}, ${englishPossibleAnswers}, ${englishCorrectAnswers},
    ${difficulty}
)
RETURNING id;
