// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jtbohtemkqrlkzsvyyuq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Ym9odGVta3FybGt6c3Z5eXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDg2NTAsImV4cCI6MjA2MDAyNDY1MH0.ULfqQj_37KaK6FbZJJudtwePwiL5C0PNIf6eFGA-dDU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);