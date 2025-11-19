-- Drop the table if it exists to start fresh
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create the events table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    ticketsAvailable INTEGER NOT NULL
);

-- Insert mock data for testing
INSERT INTO events (name, date, ticketsAvailable) VALUES
  ('Community Fall Festival', '2025-10-25', 200),
  ('Tech Innovators Summit', '2025-11-15', 150),
  ('Annual Charity Gala', '2025-12-05', 100),
  ('New Year Concert', '2025-12-31', 500),
  ('Spring Garden Show', '2026-03-20', 300);