SELECT
    q.id AS question_id,
    q.polish_question_body AS polish_question_body,
    q.polish_possible_answers AS polish_possible_answers,
    q.polish_correct_answers AS polish_correct_answers,
    q.english_question_body AS english_question_body,
    q.english_possible_answers AS english_possible_answers,
    q.english_correct_answers AS english_correct_answers,
    q.difficulty AS difficulty,
    CASE WHEN aq.question_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_answered
FROM 
    units u
LEFT JOIN
    topics t ON u.id = t.unit_id
LEFT JOIN
    questions q ON q.topic_id = t.id
LEFT JOIN
    answered_questions aq ON aq.question_id = q.id
WHERE
    u.id = ${unit_id}
    AND aq.user_id = ${user_id}
    AND t.id = ${topic_id}
