INSERT INTO users(id, nickname)
VALUES (
    ${id},
    ${nickname}
)
RETURNING *;
