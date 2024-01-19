INSERT INTO units(unit)
VALUES (
    ${unit}
)
RETURNING *;
