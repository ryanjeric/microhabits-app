-- Add last_completed_at column to habits table
ALTER TABLE habits ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMP WITH TIME ZONE;

-- Add an index for faster querying of last_completed_at
CREATE INDEX IF NOT EXISTS idx_habits_last_completed_at ON habits(last_completed_at); 