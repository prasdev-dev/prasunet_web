import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log for debugging (remove in production)
if (typeof window === 'undefined') {
  // Server-side logging
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables on server');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase initialization failed - environment variables are missing');
  console.error('On Cloudflare Pages: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Settings → Environment Variables');
  console.error('In development: Add to .env.local file');
  throw new Error(`Supabase configuration error: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : ''} ${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''} not set`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);