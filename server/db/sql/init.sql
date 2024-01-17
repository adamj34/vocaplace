SET TIME ZONE 'EUROPE/WARSAW';

CREATE TABLE IF NOT EXISTS units (
  id SMALLSERIAL PRIMARY KEY,
  unit TEXT UNIQUE NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id SMALLSERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  topic TEXT UNIQUE NOT NULL,
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
  content TEXT NOT NULL,
  correct_answers TEXT[] NOT NULL,
  misleading_answers TEXT[],
  question_type question_type NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY ,
  username TEXT NOT NULL,
  bio TEXT,
  private_profile BOOLEAN NOT NULL DEFAULT false,
  points INTEGER NOT NULL DEFAULT 0,
  ongoing_streak INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_pictures (
  id UUID PRIMARY KEY REFERENCES users(id),
  picture BYTEA NOT NULL
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

