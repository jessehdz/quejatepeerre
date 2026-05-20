import { createClient } from '@supabase/supabase-js';

/* Initialize Supabase client with the URL and anonymous key from environment variables - 
sets up the connection to the Supabase backend for database interactions and authentication. */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);