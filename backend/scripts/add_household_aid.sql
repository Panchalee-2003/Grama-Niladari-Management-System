CREATE TABLE IF NOT EXISTS household_aid (
    aid_id SERIAL PRIMARY KEY,
    household_id INTEGER REFERENCES household(household_id) ON DELETE CASCADE,
    receiver_name VARCHAR(255) NOT NULL,
    aid_type VARCHAR(100) NOT NULL
);
