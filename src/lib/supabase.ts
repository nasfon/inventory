import { GoTrueClient } from '@supabase/auth-js'
import { PostgrestClient } from '@supabase/postgrest-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
  )
}

const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  headers: { apikey: supabaseAnonKey },
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
})

const postgrest = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: { apikey: supabaseAnonKey },
  schema: 'public',
})

const attachSession = (session: { access_token: string } | null) => {
  if (session) {
    postgrest.headers.set('Authorization', `Bearer ${session.access_token}`)
  } else {
    postgrest.headers.delete('Authorization')
  }
}

void auth.getSession().then(({ data }) => attachSession(data.session))
auth.onAuthStateChange((_event, session) => attachSession(session))

export const supabase = {
  auth,
  from: (table: string) => postgrest.from(table),
  rpc: (fn: string, args?: object) => postgrest.rpc(fn, args),
}