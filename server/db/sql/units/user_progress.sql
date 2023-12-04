SELECT
    u.unit,
    ROUND(COALESCE(
        COUNT(aq.id) FILTER (WHERE aq.user_id = ${id})::numeric / NULLIF(COUNT(DISTINCT q.id), 0), 0
    ), 2) AS completion_ratio
FROM
    units u
LEFT JOIN
    questions q ON q.unit_id = u.id
LEFT JOIN 
    answered_questions aq ON aq.question_id = q.id
GROUP BY
    u.id
