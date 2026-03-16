"use client";

import { useEffect, useState } from "react";
import { Shape } from "@/lib/types";
import ShapeForm from "@/components/ShapeForm";
import ShapeRenderer from "@/components/ShapeRenderer";

export default function AdminPage() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [loading, setLoading] = useState(true);
    const [editShape, setEditShape] = useState<Shape | null>(null);

    async function fetchShapes() {
        try {
            const res = await fetch("/api/shapes");
            const data: Shape[] = await res.json();
            setShapes(data);
        } catch (err) {
            console.error("Failed to fetch shapes:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShapes();
    }, []);

    function handleFormSuccess() {
        fetchShapes();
        setEditShape(null);
    }

    function handleEdit(shape: Shape) {
        setEditShape(shape);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Delete this shape?")) return;

        try {
            const res = await fetch(`/api/shapes/${id}`, { method: "DELETE" });
            if (res.ok) {
                setShapes((prev) => prev.filter((s) => s.id !== id));

                // if we were editing the shape we just deleted, bail out of edit mode
                if (editShape?.id === id) setEditShape(null);
            }
        } catch (err) {
            console.error("Failed to delete shape:", err);
        }
    }

    function formatTimestamp(iso: string): string {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    return (
        <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
                    Admin Portal
                </h1>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Manage shapes</p>

                <div className="mt-8">
                    <ShapeForm onSuccess={handleFormSuccess} editShape={editShape} />
                </div>

                <div className="mt-10">
                    {loading ? (
                        <p className="text-center text-zinc-500">Loading...</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="px-4 py-3 text-left">Timestamp</th>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Shape</th>
                                    <th className="px-4 py-3 text-left">Edit</th>
                                    <th className="px-4 py-3 text-left">Delete</th>
                                </tr>
                            </thead>

                            <tbody>
                                {shapes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-3 text-center text-gray-500"
                                        >
                                            No shapes yet
                                        </td>
                                    </tr>
                                ) : (
                                    shapes.map((s, index) => (
                                        <tr
                                            key={s.id}
                                            className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3">
                                                {formatTimestamp(s.created_at)}
                                            </td>
                                            <td className="px-4 py-3">{s.name}</td>
                                            <td className="px-4 py-3">
                                                <ShapeRenderer shape={s.shape} color={s.color} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleEdit(s)}
                                                    className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
