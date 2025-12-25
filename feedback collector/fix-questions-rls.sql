-- Fix RLS policies for questions table to allow admin operations
-- Run this in your Supabase SQL editor

-- First, check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'questions';

-- Add missing RLS policies for questions table (only if they don't exist)
DO $$ 
BEGIN
    -- Check and create UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'questions' AND policyname = 'Allow public update to questions'
    ) THEN
        CREATE POLICY "Allow public update to questions" ON questions
            FOR UPDATE USING (true) WITH CHECK (true);
    END IF;

    -- Check and create DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'questions' AND policyname = 'Allow public delete from questions'
    ) THEN
        CREATE POLICY "Allow public delete from questions" ON questions
            FOR DELETE USING (true);
    END IF;
END $$;