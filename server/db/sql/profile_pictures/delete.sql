DELETE FROM profile_pictures
WHERE id = ${id}
RETURNING id;
