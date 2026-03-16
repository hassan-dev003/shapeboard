/**
 * Supabase Client Configuration
 *
 * This file exports two Supabase clients:
 *
 * 1. `supabaseBrowser` — A browser-safe client using @supabase/ssr.
 *    ✅ Safe to use in Client Components (use client).
 *    ❌ Do NOT use on the server for privileged operations.
 *
 * 2. `supabaseAdmin` — A service-role client using @supabase/supabase-js.
 *    ✅ Safe to use in API routes and server-only code.
 *    ❌ NEVER expose to the browser — it bypasses Row Level Security.
 */

import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Browser client – for use in Client Components
// ---------------------------------------------------------------------------
export const supabaseBrowser = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ---------------------------------------------------------------------------
// Admin / service-role client – for use in API routes ONLY
// ---------------------------------------------------------------------------
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);
