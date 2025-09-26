import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gfugbqauosdgrgeqtdnd.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdWdicWF1b3NkZ3JnZXF0ZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTc3MjksImV4cCI6MjA3MjM5MzcyOX0.2_m34xeupYL1GKi4gzand4FnrKfqIgoPOHodiNsanMs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
