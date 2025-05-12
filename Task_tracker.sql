-- Active: 1745064282933@@127.0.0.1@5432@task_tracker
-- Create the database
CREATE DATABASE task_tracker;

-- Switch to the database if needed (in psql: \c task_tracker)

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,                          -- name can be longer than 15 characters
    email TEXT NOT NULL UNIQUE,                  -- email usually exceeds 15 characters
    password TEXT NOT NULL,
    country TEXT NOT NULL                        -- increased from 10 to support longer country names like 'United Kingdom'
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) CHECK (status IN ('Pending', 'Completed'))
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL UNIQUE,                  -- changed to TEXT to avoid limit issues
    description TEXT NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Pending', 'Completed')),
    date_of_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_of_completion TIMESTAMP
);

ALTER TABLE projects
ALTER COLUMN status TYPE VARCHAR(20);

-- Alter Projects table to include user_id
ALTER TABLE projects ADD COLUMN user_id INT REFERENCES users(id) ON DELETE CASCADE;

-- Alter Tasks table to include user_id
ALTER TABLE tasks ADD COLUMN user_id INT REFERENCES users(id) ON DELETE CASCADE;

SELECT * FROM tasks;