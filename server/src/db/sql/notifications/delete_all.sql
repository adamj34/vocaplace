DELETE FROM notifications
where user_id = ${userId}
RETURNING *;