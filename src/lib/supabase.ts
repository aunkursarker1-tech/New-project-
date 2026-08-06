import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getSafeSupabaseUrl(urlStr: string | undefined): string {
  const fallback = 'https://placeholder.supabase.co';
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.trim()) {
    return fallback;
  }
  try {
    const formatted = urlStr.trim().startsWith('http://') || urlStr.trim().startsWith('https://')
      ? urlStr.trim()
      : `https://${urlStr.trim()}`;
    const parsed = new URL(formatted);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return formatted;
    }
  } catch (e) {
    // Malformed URL provided in environment variable
  }
  return fallback;
}

const supabaseUrl = getSafeSupabaseUrl(rawUrl);
const supabaseAnonKey = (rawKey && typeof rawKey === 'string' && rawKey.trim()) ? rawKey.trim() : 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or invalid. Using local authentication fallback.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

