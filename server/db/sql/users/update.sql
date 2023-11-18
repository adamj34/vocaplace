UPDATE users
SET bio = COALESCE(NULLIF(${bio}, ''), bio),
SET nickname = COALESCE(NULLIF(${nickname}, ''), nickname),
SET private_profile = COALESCE(NULLIF(${privateProfile}, ''), private_profile)
WHERE id = ${id};
RETURNING id;
