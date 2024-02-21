UPDATE users
SET bio = COALESCE(${bio}, bio),
    username = COALESCE(${username}, username),
    private_profile = COALESCE(${private_profile}, private_profile),
    picture = COALESCE(${picture}, picture)
WHERE id = ${id}
RETURNING id;
