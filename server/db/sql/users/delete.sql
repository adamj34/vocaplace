DELETE FROM users
WHERE id = ${id}
RETURNING id;
