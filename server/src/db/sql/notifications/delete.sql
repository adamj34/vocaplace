DELETE FROM notifications
WHERE id = ${id}
RETURNING *;