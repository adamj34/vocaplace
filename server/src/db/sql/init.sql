SET TIME ZONE 'EUROPE/WARSAW';

CREATE TABLE IF NOT EXISTS units (
  id SMALLSERIAL PRIMARY KEY,
  unit TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(unit) <= 50), 
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id SMALLSERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  topic TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(topic) <= 50),
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE question_type AS ENUM (
  'pick',
  'order',
  'connect',
  'fill'
);
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  content TEXT NOT NULL CHECK (CHAR_LENGTH(content) <= 500),
  correct_answers TEXT[] NOT NULL,
  misleading_answers TEXT[],
  question_type question_type NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY ,
  username TEXT UNIQUE NOT NULL,
  bio TEXT CHECK (CHAR_LENGTH(bio) <= 500),
  picture TEXT,
  private_profile BOOLEAN NOT NULL DEFAULT false,
  points INTEGER NOT NULL DEFAULT 0,
  ongoing_streak INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE relationship_state AS ENUM (
  'pending_user1_user2',
  'pending_user2_user1',
  'friends'
);
CREATE TABLE IF NOT EXISTS user_relationships (
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  relationship relationship_state NOT NULL,
  PRIMARY KEY (user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

CREATE TABLE IF NOT EXISTS repetitions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS answered_questions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  group_name TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(group_name) <= 50),
  bio TEXT CHECK (CHAR_LENGTH(bio) <= 500),
  picture TEXT
);

CREATE TABLE IF NOT EXISTS group_membership (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  admin BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, group_id)
);


/* 
TEST INSERTS
*/

INSERT INTO units (unit) VALUES ('Introduction to English');
INSERT INTO topics (unit_id, topic) VALUES (1, 'Greetings');
INSERT INTO topics (unit_id, topic) VALUES (1, 'Numbers and Counting');
INSERT INTO topics (unit_id, topic) VALUES (1, 'Days of the Week');

INSERT INTO units (unit) VALUES ('Vocabulary Building');
INSERT INTO topics (unit_id, topic) VALUES (2, 'Travel');
INSERT INTO topics (unit_id, topic) VALUES (2, 'Food');
INSERT INTO topics (unit_id, topic) VALUES (2, 'Animals');

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'Which of the following is a common response to the greeting "How are you?"', '{"I have been better.", "Fine, thank you."}', '{"Goodbye!", "Nice to meet you.", "See you later!"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'In what situation is it appropriate to say "Nice to meet you"?', '{"Introducing yourself."}', '{"Asking for directions.", "Saying goodbye."}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'How do you greet someone in the evening?', '{"Good evening."}', '{"Good night.", "Good afternoon.", "Good day."}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'In a formal email, what is a suitable greeting to use when you don''t know the recipient''s name?', '{"Dear Sir/Madam,"}', '{"Hey!", "Hi there!", "See you soon."}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'What do you say before going to sleep?', '{"Good night."}', '{"Good morning.", "Good afternoon.", "Good day."}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'What is a polite way to ask about someone''s name?', '{"What is your name?", "May I ask your name?"}', '{"Who are you?", "What is this?"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (1, 'Which question can be used to ask about someone about their interests or hobbies?', '{"What do you do for fun?"}', '{"How are you?", "What is your name?", "Do you like me?"}', 'pick', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (1, 'Put the words in the correct order to translate: "Miło mi cię poznać."', '{"nice to meet you"}', '{"nice", "cat", "for", "to", "meet", "am", "you"}', 'order', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (1, 'Put the words in the correct order to translate: "Miło cię widzieć."', '{"Nice to see you"}', '{"Nice", "cat", "for", "to", "meet", "am", "you"}', 'order', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (1, 'How are you ...?', '{"doing"}', '{"doing", "going", "feeling", "being"}', 'fill', 1);

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (2, 'Which of these are odd numbers?', '{"sixty five", "eleven"}', '{"six", "twenty eight", "seventy two"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (2, 'Which of these are even numbers?', '{"eighty two", "twelve"}', '{"seventeen", "thirty seven", "five"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (2, 'Which of these numbers are greater than twenty?', '{"thirty one", "one hundred"}', '{"seven", "twelve", "nineteen"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (2, 'How do you say 4 in English?', '{"four"}', '{"two", "three", "one", "five"}', 'pick', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (2, 'How do you say 45 in English?', '{"forty five"}', '{"forty", "hive", "four", "five"}', 'order', 2);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (2, 'How do you say 100 in English?', '{"one hundred"}', '{"one", "two", "hunded", "four"}', 'order', 2);

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (3, 'What is the first day of the week?', '{"Monday"}', '{"Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (3, 'What is the second day of the week?', '{"Tuesday"}', '{"Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (3, 'What is the last day of the week?', '{"Friday"}', '{"Tuesday", "Monday", "Thursday", "Saturday", "Sunday"}', 'pick', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (3, 'Put the words in the correct order to translate: "Jaki jest dzisiaj dzień?"', '{"What day is it today?"}', '{"What", "day", "month", "is", "today?", "yesterday", "it"}', 'order', 1);
-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (3, 'Put the words in the correct order to translate: "Jaki jest jutro dzień?"', '{"What day is it tomorrow?"}', '{"What", "tomorrow?", "day", "month", "is", "today?", "yesterday", "it"}', 'order', 2);

-- INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
-- VALUES (4, 'What is your favorite vacation ...?', '{"destination"}', '{"destination", "world", "land", "cottage"}', 'fill', 1);

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (4, 'Which of these are vehicles?', '{"Train", "Car", "Plane"}', '{"Drawer", "Crane"}', 'pick', 1);

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (5, 'Which of these products come are diary?', '{"Milk", "Cheese"}', '{"Meat", "Wheat", "Greese"}', 'pick', 1);

INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which of these are birds?', '{"Eagle", "Ostrich", "Chicken"}', '{"Donkey", "Cheetah"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which of these animals live underground?', '{"Mole", "Worm"}', '{"Deer", "Sparrow", "Salmon"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which of these are pets?', '{"Hamster", "Cat"}', '{"Dolphin", "Boar", "Shark"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'What do we call a baby cow?', '{"Foal"}', '{"Cowlet", "Calf", "Cub", "Pup"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which of the following is a large, herbivorous mammal with a trunk?', '{"Elephant"}', '{"Dolphin", "Giraffe", "Lion", "Hippo"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which bird is known for its ability to imitate human speech?', '{"Parrot"}', '{"Penguin", "Owl", "Petrel"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which of the following is a marine mammal known for its playful behavior and intelligence?', '{"Dolphin", "Porpoise"}', '{"Shark", "Jellyfish"}', 'pick', 1);
INSERT INTO questions (topic_id, content, correct_answers, misleading_answers, question_type, difficulty)
VALUES (6, 'Which reptile is known for changing color to blend with its surroundings?', '{"Chameleon"}', '{"Crocodile", "Snake", "Tortoise"}', 'pick', 1);




-- INSERT INTO user_relationships (user1_id, user2_id, relationship) VALUES ('3a84759d-8ea5-40d7-91f7-f22440d2d866', 'db77d276-7c84-4543-908b-d4ac92f031ec', 'friends');
-- INSERT INTO user_relationships (user1_id, user2_id, relationship) VALUES ('3a84759d-8ea5-40d7-91f7-f22440d2d866', 'e0b0b2a0-0b1e-4b0e-9b0a-9b0b0b0b0b0b', 'friends');
