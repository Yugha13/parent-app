import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ckelqxeojehdrfatjqtd.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZWxxeGVvamVoZHJmYXRqcXRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgwNzY0NSwiZXhwIjoyMDc0MzgzNjQ1fQ.UR9BWriS2Ud7P9p4ZNfak9WMnB-aYExTx1cRMQ7VEAI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
