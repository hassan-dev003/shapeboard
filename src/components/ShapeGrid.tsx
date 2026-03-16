"use client";

import { Shape } from "@/lib/types";
import ShapeRenderer from "@/components/ShapeRenderer";

interface ShapeGridProps {
    shapes: Shape[];
}

function formatTimestamp(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function ShapeGrid({ shapes }: ShapeGridProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left">Timestamp</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Shape</th>
                    </tr>
                </thead>

                <tbody>
                    {shapes.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
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
                                <td className="whitespace-nowrap px-4 py-3">{formatTimestamp(s.created_at)}</td>
                                <td className="px-4 py-3">{s.name}</td>
                                <td className="px-4 py-3">
                                    <ShapeRenderer shape={s.shape} color={s.color} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
