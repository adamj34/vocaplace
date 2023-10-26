INSERT INTO questions(question, answer, possible_answers, category, difficulty)
VALUES($1, $2, $3, $4, $5)
RETURNING *;