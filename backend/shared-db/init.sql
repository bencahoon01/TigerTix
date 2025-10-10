CREATE TABLE IF NOT EXISTS events (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name TEXT NOT NULL,
                                      date TEXT NOT NULL,
                                      ticketsAvailable INTEGER NOT NULL
);