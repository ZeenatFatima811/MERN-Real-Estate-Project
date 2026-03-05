import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lczwwkkyilnysiafdjuj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjend3a2t5aWxueXNpYWZkanVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjY0NDMsImV4cCI6MjA4ODA0MjQ0M30.SZ0yxPGvY0E537P0yEVLbb5pXVegvelDKEtrvwkTNOk'

export const supabase = createClient(supabaseUrl, supabaseKey)