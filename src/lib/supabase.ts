import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fvcgtdkohqmqykbiarme.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y2d0ZGtvaHFtcXlrYmlhcm1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgzNTIxOCwiZXhwIjoyMDkzNDExMjE4fQ.jsvmC1swET4bR7nwpa9BSWNAcHCqMeMMZ0evCKVepwo";

export const supabase = createClient(supabaseUrl, supabaseKey);