import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão definidas.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)