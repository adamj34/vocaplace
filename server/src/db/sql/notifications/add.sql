INSERT into notifications (user_id,friend_id,group_id,notification_type)
values (
    ${userId},
    ${senderId},
    ${groupId},
    ${notification_type}
)
RETURNING *;