INSERT into notifications (user_id,friend_id,group_id,notification_type)
values (
    ${user_id},
    ${friend_id},
    ${group_id},
    ${notification_type}
)
RETURNING *;