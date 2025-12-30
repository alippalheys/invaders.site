import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_RORK_DB_TOKEN;

  console.log("[Supabase] Initializing client...", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey,
  });

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[Supabase] Missing env vars - SUPABASE_URL/EXPO_PUBLIC_RORK_DB_ENDPOINT or SUPABASE_SERVICE_ROLE_KEY/EXPO_PUBLIC_RORK_DB_TOKEN");
    throw new Error("Missing Supabase configuration. Please check your environment variables.");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    // Removing aggressive timeout or making it longer (15s) to avoid premature failures on cold starts
    global: {
      fetch: (url, options = {}) => {
        // Add a 10s timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        return fetch(url, { ...options, signal: controller.signal })
          .finally(() => clearTimeout(timeoutId));
      },
    },
  });
  
  console.log("[Supabase] Client initialized successfully");
  return supabaseInstance;
}

// Proxy to lazy-load the client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
