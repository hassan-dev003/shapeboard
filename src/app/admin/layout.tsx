"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";

// guards /admin routes behind a supabase session.
//
// uses @supabase/ssr (not the deprecated auth-helpers-nextjs) because it
// consolidates all the old client factories into a single createBrowserClient
// that handles cookie-based sessions automatically.
//
// flow: check session on mount → show loading → redirect to /login or render children.
export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    // null = checking, true = authed, false = nope
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setAuthenticated(true);
            } else {
                router.push("/login");
            }
        });
    }, [router]);

    if (authenticated === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Checking authentication…</p>
            </div>
        );
    }

    // redirect is already in-flight, just render nothing until it lands
    if (!authenticated) return null;
    async function handleLogout() {
        await supabaseBrowser.auth.signOut();
        router.push("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
                <Link
                    href="/"
                    className="text-lg font-semibold text-gray-900 transition-colors hover:text-indigo-600"
                >
                    Shapeboard Admin
                </Link>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            {children}
        </div>
    );
}
