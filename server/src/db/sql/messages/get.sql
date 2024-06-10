SELECT m.id,
    m.user_id,
    m.group_id,
    m.message,
    to_char(m.created_at  AT TIME ZONE   'Europe/Warsaw', 'YYYY-MM-DD HH24:MI') as created_at,
    u.username,
    u.picture,
    COALESCE(gm.admin, false) as admin
FROM messages m
left JOIN users u on m.user_id = u.id
left JOIN group_membership gm on m.group_id = gm.group_id and m.user_id = gm.user_id
WHERE m.group_id = ${groupId}
order by m.created_at desc;