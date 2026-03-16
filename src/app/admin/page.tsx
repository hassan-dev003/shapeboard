"use client";

import { useEffect, useState } from "react";
import { Shape } from "@/lib/types";
import ShapeForm from "@/components/ShapeForm";
import ShapeRenderer from "@/components/ShapeRenderer";
import Toast from "@/components/Toast";

export default function AdminPage() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [loading, setLoading] = useState(true);
    const [editShape, setEditShape] = useState<Shape | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    async function fetchShapes() {
        try {
            const res = await fetch("/api/shapes");
            const data: Shape[] = await res.json();
            setShapes(data);
        } catch (err) {
            console.error("Failed to fetch shapes:", err);
            setToast({ message: "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShapes();
    }, []);

    function handleFormSuccess() {
        setToast({ message: editShape ? "Shape updated" : "Shape added", type: "success" });
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
                setToast({ message: "Shape deleted", type: "success" });

                // bail out of edit mode if we just deleted the shape being edited
                if (editShape?.id === id) setEditShape(null);
            }
        } catch (err) {
            console.error("Failed to delete shape:", err);
            setToast({ message: "Something went wrong", type: "error" });
        }
    }

    function formatTimestamp(iso: string): string {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Portal</h1>
            <p className="mt-1 text-gray-500">Manage shapes</p>

            <div className="mt-8">
                <ShapeForm onSuccess={handleFormSuccess} editShape={editShape} />
            </div>

            <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
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
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                                {formatTimestamp(s.created_at)}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                                            <td className="px-4 py-3">
                                                <ShapeRenderer shape={s.shape} color={s.color} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleEdit(s)}
                                                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );
}
