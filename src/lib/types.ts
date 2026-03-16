/**
 * Shared TypeScript types for Shapeboard.
 *
 * These types mirror the database schema and can be safely imported
 * in both Client Components and server-side code.
 */

export interface Shape {
    id: string;
    name: string;
    shape: "circle" | "square" | "triangle";
    color: string;
    created_at: string;
}
