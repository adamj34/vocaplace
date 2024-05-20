SELECT 
    m.id,
    m.user_id,
    m.group_id,
    m.message,
    to_char(m.created_at  AT TIME ZONE   'Europe/Warsaw', 'YYYY-MM-DD HH24:MI') as created_at,
    u.username,
    u.picture,
    gm.admin
FROM messages m
LEFT JOIN users u
ON m.user_id = u.id
LEFT JOIN group_membership gm
ON m.group_id = gm.group_id AND m.user_id = gm.user_id
WHERE m.id = ${id};