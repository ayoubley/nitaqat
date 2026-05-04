import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fvcgtdkohqmqykbiarme.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y2d0ZGtvaHFtcXlrYmlhcm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUyMTgsImV4cCI6MjA5MzQxMTIxOH0.kQJnDIULOXZ9-rSUCFxrrsqCy7ijY1BLo4SQ9IqcxJU";

export const supabase = createClient(supabaseUrl, supabaseKey);