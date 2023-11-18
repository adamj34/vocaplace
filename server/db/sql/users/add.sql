INSERT INTO users(id)
VALUES (
    ${id},
)
RETURNING id;
