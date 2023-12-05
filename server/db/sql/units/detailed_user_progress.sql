SELECT
    t.id AS topic_id,
    t.topic
FROM
    topics t
LEFT JOIN
    units u ON t.id = u.topic_id
LEFT JOIN 
    questions q ON q.unit_id = u.id
LEFT JOIN
    answered_questions aq ON aq.question_id = q.id
WHERE
    u.id = ${unit_id}
GROUP BY
    t.id
