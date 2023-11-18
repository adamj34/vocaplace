INSERT INTO unit(topic_id, unit)
VALUES (
    ${topicId},
    ${unit},
)
RETURNING *;
