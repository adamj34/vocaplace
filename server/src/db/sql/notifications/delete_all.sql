DELETE FROM notifications
where user_id = ${user_id}
RETURNING *;