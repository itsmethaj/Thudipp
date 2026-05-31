import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hnziqyufhxifzxnrscix.supabase.co";
const supabaseAnonKey = "sb_publishable_Q-KEk4-velK3Z_wHcT2s5A__QhFuL6v";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);