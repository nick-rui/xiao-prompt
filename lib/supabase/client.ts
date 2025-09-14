import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://gnucrhmkcjemvpdpqcum.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudWNyaG1rY2plbXZwZHBxY3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODk4NjksImV4cCI6MjA3MzM2NTg2OX0.1oYQiWWuLRDSHjWpLH04zs_OqbeGtp5LYlHD8IEAHqM"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
