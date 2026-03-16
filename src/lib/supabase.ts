import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// browser client — safe for "use client" components
export const supabaseBrowser = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// lazy init so importing this module from client code doesn't blow up
// (SUPABASE_SECRET_KEY is server-only and won't exist in the browser)
export function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    );
}
