import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validateShape } from "@/lib/validations";

// GET /api/shapes — Return all shapes, newest first.
export async function GET() {
    try {
        const { data, error } = await getSupabaseAdmin()
            .from("shapes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("GET /api/shapes error:", err);
        return NextResponse.json(
            { error: "Failed to fetch shapes" },
            { status: 500 },
        );
    }
}

// POST /api/shapes — Create a new shape after validation.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { valid, errors } = validateShape(body);
        if (!valid) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { name, shape, color } = body;

        const { data, error } = await getSupabaseAdmin()
            .from("shapes")
            .insert({ name, shape, color })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error("POST /api/shapes error:", err);
        return NextResponse.json(
            { error: "Failed to create shape" },
            { status: 500 },
        );
    }
}
