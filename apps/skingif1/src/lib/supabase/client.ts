import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nlbdvmialbgyrxzzpbrw.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!key && typeof window !== 'undefined') {
    console.error('CRITICAL: Supabase Anon Key is missing in environment variables.');
  }

  return createBrowserClient(url, key);
}
