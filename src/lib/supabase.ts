import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function cleanString(str: string | undefined): string {
  return (str || '')
    .replace(/[\u200B-\u200D\u200E\u200F\uFEFF]/g, '')
    .replace(/^["']|["']$/g, '')
    .trim();
}

const cleanedUrl = cleanString(rawUrl);
const cleanedKey = cleanString(rawKey);

function getSafeSupabaseUrl(urlStr: string): string {
  const fallback = 'https://placeholder.supabase.co';
  if (!urlStr) {
    return fallback;
  }
  try {
    const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://')
      ? urlStr
      : `https://${urlStr}`;
    const parsed = new URL(formatted);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return formatted;
    }
  } catch (e) {
    // Malformed URL provided in environment variable
  }
  return fallback;
}

const supabaseUrl = getSafeSupabaseUrl(cleanedUrl);
const supabaseAnonKey = cleanedKey || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  cleanedUrl &&
  cleanedKey &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or invalid.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

