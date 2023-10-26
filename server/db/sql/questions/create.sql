CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    possible_answers TEXT[] NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty INTEGER NOT NULL
);