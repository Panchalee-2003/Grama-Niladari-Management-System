-- Migration: extend household table for full registration flow
ALTER TABLE household
  ADD COLUMN IF NOT EXISTS status         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS phone_number   VARCHAR(20),
  ADD COLUMN IF NOT EXISTS income_source  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS govt_aid       VARCHAR(10),
  ADD COLUMN IF NOT EXISTS income_range   VARCHAR(50),
  ADD COLUMN IF NOT EXISTS notes          TEXT;
