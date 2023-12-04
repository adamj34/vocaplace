UPDATE user_relationships
SET relationship = ${relationship}
WHERE user1_id = ${user1_id} AND user2_id = ${user2_id}
RETURNING *;
