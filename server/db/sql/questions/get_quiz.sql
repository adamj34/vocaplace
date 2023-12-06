SELECT
    json_agg(
        json_build_object(
            'question_id', q.id,
            'polish_question_body', q.polish_question_body,
            'polish_possible_answers', q.polish_possible_answers,
            'polish_correct_answers', q.polish_correct_answers,
            'english_question_body', q.english_question_body,
            'english_possible_answers', q.english_possible_answers,
            'english_correct_answers', q.english_correct_answers,
            'difficulty', q.difficulty,
            'is_answered', TRUE
        )
    ) FILTER (WHERE aq.question_id IS NOT NULL) AS answered_questions,
    json_agg(
        json_build_object(
            'question_id', q.id,
            'polish_question_body', q.polish_question_body,
            'polish_possible_answers', q.polish_possible_answers,
            'polish_correct_answers', q.polish_correct_answers,
            'english_question_body', q.english_question_body,
            'english_possible_answers', q.english_possible_answers,
            'english_correct_answers', q.english_correct_answers,
            'difficulty', q.difficulty,
            'is_answered', FALSE
        )
    ) FILTER (WHERE aq.question_id IS NULL) AS unanswered_questions
FROM 
    units u
LEFT JOIN
    topics t ON u.id = t.unit_id
LEFT JOIN
    questions q ON q.topic_id = t.id
LEFT JOIN
    answered_questions aq ON aq.question_id = q.id AND aq.user_id = ${user_id}
WHERE
    u.id = ${unit_id}
    AND t.id = ${topic_id}
