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
    if (shapes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="64" height="52" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                    <rect x="20" y="24" width="16" height="16" rx="2" fill="#CBD5E1" />
                    <circle cx="52" cy="32" r="8" fill="#CBD5E1" />
                    <polygon points="28,52 40,36 52,52" fill="#CBD5E1" />
                    <rect x="24" y="68" width="32" height="4" rx="2" fill="#E2E8F0" />
                </svg>
                <p className="text-gray-500 font-medium mt-4">No shapes here yet</p>
                <p className="text-gray-400 text-sm mt-1">Add one from the admin portal to get started</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left">Timestamp</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Shapecolor</th>
                    </tr>
                </thead>

                <tbody>
                    {shapes.map((s, index) => (
                        <tr
                            key={s.id}
                            className={`shape-row-enter border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{formatTimestamp(s.created_at)}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                            <td className="px-4 py-3">
                                <ShapeRenderer shape={s.shape} color={s.color} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
