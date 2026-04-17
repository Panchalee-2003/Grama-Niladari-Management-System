CREATE TABLE IF NOT EXISTS password_reset_otp (
  otp_id     SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL
               REFERENCES user_table(user_id) ON DELETE CASCADE,
  email      VARCHAR(255) NOT NULL,
  otp_code   VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_user_id ON password_reset_otp(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_email   ON password_reset_otp(email);
