SELECT 
    users.*, 
    (SELECT profile_pictures.picture FROM profile_pictures WHERE profile_pictures.id = users.id) AS picture
FROM users
WHERE users.id = ${id};
