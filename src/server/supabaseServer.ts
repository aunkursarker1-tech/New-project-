import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function cleanString(str: string | undefined | null): string {
  return (str || '')
    .replace(/[\u200B-\u200D\u200E\u200F\uFEFF]/g, '')
    .replace(/^["']|["']$/g, '')
    .trim();
}

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = cleanString(
    process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ''
  );
  const key = cleanString(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ''
  );

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  try {
    return createClient(url, key);
  } catch (err) {
    console.warn('[Supabase Server Client Error]', err);
    return null;
  }
}
