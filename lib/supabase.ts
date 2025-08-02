import { createClient } from "@supabase/supabase-js"

// Create a single Supabase client for the server-side (Server Actions)
// This client should NOT be used on the client-side due to potential API key exposure
export function createSupabaseServerClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables for server client.")
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false, // No session persistence on server
    },
  })
}

// Create a single Supabase client for the client-side (React components)
// This client uses the public anon key and should be used for client-side operations
let supabaseBrowserClient: ReturnType<typeof createClient> | undefined

export function createSupabaseBrowserClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables for browser client.")
  }
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  }
  return supabaseBrowserClient
}
