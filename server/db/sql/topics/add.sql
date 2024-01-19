INSERT INTO topics(unit_id, topic)
VALUES (
    ${unit_id},
    ${topic}
)
RETURNING *;
