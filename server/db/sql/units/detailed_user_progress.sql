SELECT
    t.id AS topic_id,
    t.topic AS topic,
    t.created_at AS topic_created_at,
    q.id AS question_id,
    q.difficulty AS difficulty,
    CASE 
        WHEN aq.question_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_answered
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
