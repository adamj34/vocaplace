INSERT INTO messages (user_id,group_id, message, created_at) 
VALUES ( ${userId},${groupId}, ${message}, now() )
RETURNING *;