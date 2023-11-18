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
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  group_id INTEGER NOT NULL REFERENCES groups(id)
  admin BOOLEAN NOT NULL DEFAULT false
);


/* 
INSERTS
*/

-- -- Insert subcategories of English language questions
-- INSERT INTO question_subcategories (id, subcategory) VALUES
--   (1, 'Vocabulary'),
--   (2, 'Grammar'),
--   (3, 'Reading Comprehension'),
--   (4, 'Listening Comprehension'),
--   (5, 'Phonetics'),
--   (6, 'Writing Practice');

-- -- Insert English language question categories
-- INSERT INTO question_categories (id, subcategory_id, category) VALUES
--   (1, 1, 'Vocabulary Fill-in-the-Blanks'),
--   (2, 1, 'Grammar Exercises'),
--   (3, 2, 'Reading Comprehension'),
--   (4, 3, 'Listening Practice'),
--   (5, 4, 'Pronunciation'),
--   (6, 5, 'Sentence Writing');

-- -- Insert sample English language learning questions
-- INSERT INTO questions (id, category_id, polish_question_body, polish_possible_answers, polish_correct_answers, english_question_body, english_possible_answers, english_correct_answers, difficulty) VALUES
--   (1, 1, 'Fill in the blank: The ____ is red.', ARRAY['cat', 'dog', 'apple'], 'apple', 'Fill in the blank: The ____ is red.', ARRAY['cat', 'dog', 'apple'], 'apple', 1),
--   (2, 1, 'Choose the correct word to fill in the blank: She has a lovely _____.', ARRAY['friend', 'pizza', 'garden'], 'garden', 'Choose the correct word to fill in the blank: She has a lovely _____.', ARRAY['friend', 'pizza', 'garden'], 'garden', 2),
--   (3, 2, 'Select the correct form of the verb: She _____ (eat) breakfast every morning.', ARRAY['eats', 'ate', 'eating'], 'eats', 'Select the correct form of the verb: She _____ (eat) breakfast every morning.', ARRAY['eats', 'ate', 'eating'], 'eats', 2),
--   (4, 2, 'Fill in the blank with the appropriate pronoun: ____ (He/She) is my best friend.', ARRAY['He', 'She', 'They'], 'He', 'Fill in the blank with the appropriate pronoun: ____ (He/She) is my best friend.', ARRAY['He', 'She', 'They'], 'He', 1),
--   (5, 2, 'Complete the sentence with the correct preposition: The book is ____ (on/in/under) the table.', ARRAY['on', 'in', 'under'], 'on', 'Complete the sentence with the correct preposition: The book is ____ (on/in/under) the table.', ARRAY['on', 'in', 'under'], 'on', 3),
--   (6, 3, 'Read the following passage and answer the question: John loves to ____ (read/write) stories.', ARRAY['read', 'write'], 'write', 'Read the following passage and answer the question: John loves to ____ (read/write) stories.', ARRAY['read', 'write'], 'write', 2),
--   (7, 4, 'Listen to the audio and fill in the blank: "I ____ to the store yesterday."', ARRAY['went', 'go', 'will go'], 'went', 'Listen to the audio and fill in the blank: "I ____ to the store yesterday."', ARRAY['went', 'go', 'will go'], 'went', 1),
--   (8, 5, 'Identify the correct pronunciation of the word: "schedule."', ARRAY['sked-jool', 'sheh-dool', 'sked-yool'], 'sked-jool', 'Identify the correct pronunciation of the word: "schedule."', ARRAY['sked-jool', 'sheh-dool', 'sked-yool'], 'sked-jool', 2),
--   (9, 6, 'Write a sentence about your favorite hobby.', NULL, NULL, 'Write a sentence about your favorite hobby.', NULL, NULL, 1),
--   (10, 6, 'Compose a short paragraph about a memorable vacation.', NULL, NULL, 'Compose a short paragraph about a memorable vacation.', NULL, NULL, 3);

-- -- Insert more user data
-- INSERT INTO users (id, profile_picture_id, points, ongoing_streak, last_active) VALUES
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', NULL, 90, 4, '2023-11-01T11:30:00Z'),
--   ('4678251e-a2f2-4deb-be14-38621d04f17a', NULL, 60, 3, '2023-11-02T09:00:00Z'),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', NULL, 75, 5, '2023-11-01T14:15:00Z'),
--   ('7a1691c8-30fe-4e7b-81f6-0017fbbbe385', NULL, 110, 6, '2023-11-02T08:45:00Z'),
--   ('88dc560f-2f70-4e68-ba67-46c78976bca2', NULL, 45, 2, '2023-11-01T16:30:00Z'),
--   ('13738c8f-5e28-4f10-8645-d42f3659a9c7', NULL, 80, 4, '2023-11-02T11:15:00Z');

-- -- Insert more repetitions and answered questions for English learning questions
-- INSERT INTO repetitions (user_id, question_id) VALUES
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 6),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 7),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 7),
--   ('7a1691c8-30fe-4e7b-81f6-0017fbbbe385', 8),
--   ('88dc560f-2f70-4e68-ba67-46c78976bca2', 9),
--   ('13738c8f-5e28-4f10-8645-d42f3659a9c7', 9);
  
-- INSERT INTO answered_questions (user_id, question_id) VALUES
--   ('4678251e-a2f2-4deb-be14-38621d04f17a', 1),
--   ('4678251e-a2f2-4deb-be14-38621d04f17a', 3),
--   ('4678251e-a2f2-4deb-be14-38621d04f17a', 4),
--   ('13738c8f-5e28-4f10-8645-d42f3659a9c7', 7),
--   ('13738c8f-5e28-4f10-8645-d42f3659a9c7', 8),
--   ('13738c8f-5e28-4f10-8645-d42f3659a9c7', 10),
--   ('88dc560f-2f70-4e68-ba67-46c78976bca2', 1),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 2),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 3),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 4),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 5),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 6),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 7),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 8),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 9),
--   ('05c84047-1e98-4515-9765-0a4e477f5e06', 10),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 1),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 2),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 3),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 4),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 5),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 6),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 7),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 8),
--   ('360fb814-7585-4c6b-b503-fdd3e9854bf7', 9);

-- -- Insert more sample groups and group membership for English language learners
-- INSERT INTO groups (id, name) VALUES
--   (1, 'English Vocabulary Group'),
--   (2, 'Grammar Practice Group'),
--   (3, 'Listening Comprehension Club'),
--   (4, 'Pronunciation Practice Team'),
--   (5, 'Writing Skills Workshop'),
--   (6, 'Advanced English Learners');

-- INSERT INTO group_membership (id, user_id, group_id) VALUES
--   (1, '05c84047-1e98-4515-9765-0a4e477f5e06', 1),
--   (2, '4678251e-a2f2-4deb-be14-38621d04f17a', 2),
--   (3, '360fb814-7585-4c6b-b503-fdd3e9854bf7', 3),
--   (4, '7a1691c8-30fe-4e7b-81f6-0017fbbbe385', 4),
--   (5, '88dc560f-2f70-4e68-ba67-46c78976bca2', 5),
--   (6, '88dc560f-2f70-4e68-ba67-46c78976bca2', 6);
