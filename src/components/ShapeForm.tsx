"use client";

import { FormEvent, useEffect, useState } from "react";
import { Shape } from "@/lib/types";
import ShapeRenderer from "@/components/ShapeRenderer";

type ShapeType = Shape["shape"];

interface ShapeFormProps {
    onSuccess: () => void;
    editShape?: Shape | null;
}

const SHAPE_OPTIONS: ShapeType[] = ["circle", "square", "triangle"];

const DEFAULTS = {
    name: "",
    shape: "circle" as ShapeType,
    color: "#3B82F6",
};

export default function ShapeForm({ onSuccess, editShape }: ShapeFormProps) {
    const [name, setName] = useState(DEFAULTS.name);
    const [shape, setShape] = useState<ShapeType>(DEFAULTS.shape);
    const [color, setColor] = useState(DEFAULTS.color);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // sync form fields when switching between add/edit mode
    useEffect(() => {
        if (editShape) {
            setName(editShape.name);
            setShape(editShape.shape);
            setColor(editShape.color);
        } else {
            resetForm();
        }
    }, [editShape]);

    function resetForm() {
        setName(DEFAULTS.name);
        setShape(DEFAULTS.shape);
        setColor(DEFAULTS.color);
        setErrors([]);
    }

    // crude field-level matching — relies on the api error containing the field name
    function fieldErrors(keyword: string) {
        return errors.filter((e) =>
            e.toLowerCase().includes(keyword.toLowerCase()),
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setErrors([]);

        const payload = { name, shape, color };

        try {
            const isEdit = !!editShape;
            const url = isEdit ? `/api/shapes/${editShape!.id}` : "/api/shapes";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                if (body?.errors && Array.isArray(body.errors)) {
                    setErrors(body.errors);
                } else {
                    setErrors(["Something went wrong. Please try again."]);
                }
                return;
            }

            resetForm();
            onSuccess();
        } catch {
            setErrors(["Network error. Please check your connection."]);
        } finally {
            setSaving(false);
        }
    }

    const isEdit = !!editShape;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="shape-name"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        id="shape-name"
                        type="text"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. My Circle"
                    />
                    {fieldErrors("name").map((msg) => (
                        <p key={msg} className="mt-1 text-sm text-red-600">
                            {msg}
                        </p>
                    ))}
                </div>

                <div>
                    <label
                        htmlFor="shape-type"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Shape
                    </label>
                    <select
                        id="shape-type"
                        value={shape}
                        onChange={(e) => setShape(e.target.value as ShapeType)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {SHAPE_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    {fieldErrors("shape").map((msg) => (
                        <p key={msg} className="mt-1 text-sm text-red-600">
                            {msg}
                        </p>
                    ))}
                </div>

                <div>
                    <label
                        htmlFor="shape-color"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Color
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            id="shape-color"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                        />
                        {/* hex text input kept in sync with the picker */}
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            maxLength={7}
                            className="w-28 rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="#000000"
                        />
                    </div>
                    {fieldErrors("color").map((msg) => (
                        <p key={msg} className="mt-1 text-sm text-red-600">
                            {msg}
                        </p>
                    ))}
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">Preview</p>
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-4">
                        <ShapeRenderer shape={shape} color={color} size={80} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving..." : isEdit ? "Update Shape" : "Add Shape"}
                </button>
            </form>
        </div>
    );
}
