import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://xlseyiywpsjtgrzgfnwe.supabase.co";
// const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsc2V5aXl3cHNqdGdyemdmbndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTQyODcsImV4cCI6MjA3NjU3MDI4N30.kS9zybR3LZTsEboOeWAoF5vOxz9quYISLY3Gma1CqiQ`;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
