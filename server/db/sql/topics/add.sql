INSERT INTO topics(topic)
VALUES (
    ${topic}
)
RETURNING *;
