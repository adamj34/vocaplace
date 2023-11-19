SET TIME ZONE 'EUROPE/WARSAW';

CREATE TABLE IF NOT EXISTS topics (
  id SMALLSERIAL PRIMARY KEY,
  topic TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id SMALLSERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  unit TEXT UNIQUE NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  polish_question_body TEXT NOT NULL,
  polish_possible_answers TEXT[] NOT NULL,
  polish_correct_answers TEXT NOT NULL,
  english_question_body TEXT NOT NULL,
  english_possible_answers TEXT[] NOT NULL,
  english_correct_answers TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY ,
  points INTEGER NOT NULL DEFAULT 0,
  ongoing_streak INTEGER NOT NULL DEFAULT 0,
  nickname TEXT,
  bio TEXT,
  private_profile BOOLEAN NOT NULL DEFAULT false,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_pictures (
  id UUID PRIMARY KEY REFERENCES users(id),
  picture BYTEA NOT NULL
);

CREATE TABLE IF NOT EXISTS friends (
  user_id UUID NOT NULL REFERENCES users(id),
  friend_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS repetitions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS answered_questions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  user_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS group_pictures (
  id INTEGER PRIMARY KEY REFERENCES groups(id),
  picture BYTEA NOT NULL
);

CREATE TABLE IF NOT EXISTS group_membership (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  admin BOOLEAN NOT NULL DEFAULT false
);


/* 
TEST INSERTS
*/

-- Inserting topics
INSERT INTO topics (topic) VALUES
  ('Mathematics'),
  ('Science'),
  ('History'),
  ('Literature');

-- Inserting units
INSERT INTO units (topic_id, unit) VALUES
  (1, 'Algebra'),
  (1, 'Geometry'),
  (2, 'Physics'),
  (2, 'Chemistry'),
  (3, 'Ancient Civilizations'),
  (3, 'World Wars'),
  (4, 'Classic Literature'),
  (4, 'Modern Literature');

-- Inserting questions
INSERT INTO questions (unit_id, 
                      polish_question_body, polish_possible_answers, polish_correct_answers,
                      english_question_body, english_possible_answers, english_correct_answers,
                      difficulty) VALUES
  (1, 'What is the quadratic formula?', '{"A", "B", "C", "D"}', '{"B"}',
      'Which formula is used to find the roots of a quadratic equation?', '{"A", "B", "C", "D"}', '{"B"}', 2),
  (3, 'What is the atomic number of carbon?', '{"10", "5", "6", "12"}', '{"6"}',
      'How many protons does a carbon atom have?', '{"10", "5", "6", "12"}', '{"6"}', 1),
  (5, 'Who was the first emperor of China?', '{"Mao Zedong", "Qin Shi Huang", "Sun Yat-sen", "Deng Xiaoping"}', '{"Qin Shi Huang"}',
      'Which historical figure is known as the first emperor of China?', '{"Mao Zedong", "Qin Shi Huang", "Sun Yat-sen", "Deng Xiaoping"}', '{"Qin Shi Huang"}', 3);

-- Inserting users
INSERT INTO users (id, points, ongoing_streak, nickname, bio, private_profile, last_active, created_at) VALUES
  ('123e4567-e89b-12d3-a456-426614174001', 100, 5, 'JohnDoe', 'I love learning!', false, NOW(), NOW()),
  ('223e4567-e89b-12d3-a456-426614174002', 50, 2, 'JaneSmith', 'Passionate about science.', true, NOW(), NOW());

-- Inserting friends
INSERT INTO friends (user_id, friend_id) VALUES
  ('123e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174002');

-- Inserting repetitions
INSERT INTO repetitions (user_id, question_id) VALUES
  ('123e4567-e89b-12d3-a456-426614174001', 1),
  ('223e4567-e89b-12d3-a456-426614174002', 3);

-- Inserting answered questions
INSERT INTO answered_questions (question_id, user_id) VALUES
  (1, '123e4567-e89b-12d3-a456-426614174001'),
  (3, '223e4567-e89b-12d3-a456-426614174002');

-- Inserting groups
INSERT INTO groups (name, bio) VALUES
  ('Study Group 1', 'A group for studying mathematics'),
  ('Book Club', 'A club for literature enthusiasts');

-- Inserting group membership
INSERT INTO group_membership (user_id, group_id, admin) VALUES
  ('123e4567-e89b-12d3-a456-426614174001', 1, true),
  ('223e4567-e89b-12d3-a456-426614174002', 2, false);
