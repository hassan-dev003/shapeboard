import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validateShape } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/shapes/[id] — Partial update of an existing shape.
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const { valid, errors } = validateShape(body);
        if (!valid) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { data, error } = await getSupabaseAdmin()
            .from("shapes")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        // PGRST116 = no rows matched the filter
        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    { error: "Shape not found" },
                    { status: 404 },
                );
            }
            throw error;
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("PUT /api/shapes/[id] error:", err);
        return NextResponse.json(
            { error: "Failed to update shape" },
            { status: 500 },
        );
    }
}

// DELETE /api/shapes/[id] — Remove a shape by id.
export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        const { data, error } = await getSupabaseAdmin()
            .from("shapes")
            .delete()
            .eq("id", id)
            .select()
            .single();

        // PGRST116 = no rows matched the filter
        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    { error: "Shape not found" },
                    { status: 404 },
                );
            }
            throw error;
        }

        // data is non-null here, meaning a row was deleted.
        return new NextResponse(null, { status: 204 });
    } catch (err) {
        console.error("DELETE /api/shapes/[id] error:", err);
        return NextResponse.json(
            { error: "Failed to delete shape" },
            { status: 500 },
        );
    }
}
