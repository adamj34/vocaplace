INSERT INTO question_categories(subcategory_id, category, created_at)
VALUES (
    ${subcategoryId},
    ${category},
)
RETURNING *;