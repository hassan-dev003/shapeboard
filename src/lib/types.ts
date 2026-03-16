// mirrors the shapes table in supabase
export interface Shape {
    id: string;
    name: string;
    shape: "circle" | "square" | "triangle";
    color: string;
    created_at: string;
}
