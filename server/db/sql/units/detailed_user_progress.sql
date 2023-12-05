SELECT
    t.id AS topic_id,
    t.topic AS topic,
    t.created_at AS topic_created_at,
    json_agg(
        json_build_object(
            'question_id', q.id,
            'difficulty', q.difficulty,
            'is_answered', CASE WHEN aq.question_id IS NOT NULL THEN TRUE ELSE FALSE END
        )
    ) FILTER (WHERE q.id IS NOT NULL) AS questions
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
GROUP BY
    t.id, t.topic, t.created_at
