SELECT
    *
FROM users
LEFT JOIN profile_pictures ON profile_pictures.id = users.id
WHERE users.id = ${id};
