import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fvcgtdkohqmqykbiarme.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnc2Rsdnl4cXNvamp1bWN0ZGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY2Mjg3NCwiZXhwIjoyMDkzMjM4ODc0fQ.XOjzrkhMcX2uD0C3vwcNM0io5KHSTGUYX_xpYg4va5U";

export const supabase = createClient(supabaseUrl, supabaseKey);