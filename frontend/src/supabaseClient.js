import { createClient } from '@supabase/supabase-js';

// As chaves públicas do seu projeto Supabase (disponíveis no painel Project Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://SEU-PROJETO.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA-ANON-KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);