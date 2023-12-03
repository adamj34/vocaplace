INSERT INTO profile_pictures (id, picture)
VALUES (
    ${id},
    ${picture}
)
ON CONFLICT(id) DO UPDATE SET picture = ${picture}
RETURNING id;
