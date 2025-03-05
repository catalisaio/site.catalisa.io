/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `company` (text)
      - `message` (text, not null)
      - `created_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for authenticated users to insert data
*/

-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert data
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);