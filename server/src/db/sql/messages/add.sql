INSERT INTO messages (user_id, group_id, message, created_at) 
VALUES (${userId}, ${groupId}, ${message}, now())
RETURNING user_id,
 TO_CHAR(created_at  AT TIME ZONE   'Europe/Warsaw', 'YYYY-MM-DD HH24:MI') AS created_at,
  group_id,
   id,
    message;