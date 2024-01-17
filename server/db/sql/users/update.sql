UPDATE users
SET bio = COALESCE(${bio}, bio),
    username = COALESCE(${username}, username),
    private_profile = COALESCE(${privateProfile}, private_profile)
WHERE id = ${id}
RETURNING id;
