import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateShape } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// PUT /api/shapes/[id] — Partial update of an existing shape.
// ---------------------------------------------------------------------------
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        console.log("PUT /api/shapes/[id]", id, body);

        // Validate only the fields the caller included in the body.
        const { valid, errors } = validateShape(body);
        if (!valid) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("shapes")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        // Supabase returns a PGRST116 code when no rows match the filter.
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

// ---------------------------------------------------------------------------
// DELETE /api/shapes/[id] — Remove a shape by id.
// ---------------------------------------------------------------------------
export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        console.log("DELETE /api/shapes/[id]", id);

        const { data, error } = await supabaseAdmin
            .from("shapes")
            .delete()
            .eq("id", id)
            .select()
            .single();

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
