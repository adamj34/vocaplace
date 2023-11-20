UPDATE users
SET bio = COALESCE(${bio}, bio),
    nickname = COALESCE(${nickname}, nickname),
    private_profile = COALESCE(${privateProfile}, private_profile)
WHERE id = ${id}
RETURNING id;
