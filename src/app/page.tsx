"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";
import { Shape } from "@/lib/types";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "circle" | "square" | "triangle">("all");

  const filteredShapes = filter === "all" ? shapes : shapes.filter(s => s.shape === filter);

  const FILTER_OPTIONS = [
    { value: "all" as const, label: "All" },
    { value: "circle" as const, label: "Circle" },
    { value: "square" as const, label: "Square" },
    { value: "triangle" as const, label: "Triangle" },
  ];

  function shapeCount(type: "all" | "circle" | "square" | "triangle"): number {
    return type === "all" ? shapes.length : shapes.filter(s => s.shape === type).length;
  }

  async function fetchShapes() {
    try {
      const res = await fetch("/api/shapes");
      const data: Shape[] = await res.json();
      setShapes(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch shapes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShapes();

    // re-fetch on any realtime change so the grid stays in sync
    const channel = supabaseBrowser
      .channel("shapes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shapes" },
        () => fetchShapes(),
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Top bar with title and admin link */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Shapeboard
              <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${loading ? "bg-gray-100 text-gray-400" : "bg-indigo-100 text-indigo-700"}`}>
                {loading ? "..." : shapes.length}
              </span>
            </h1>
            <p className="mt-1 text-gray-500">Live shape grid</p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
          >
            Admin
          </Link>
        </div>

        {lastUpdated && (
          <p className="mt-4 text-sm text-gray-400">
            Last updated: {lastUpdated}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === value
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {label}{" "}
              <span className={filter === value ? "text-indigo-200" : "text-gray-400"}>
                {shapeCount(value)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <ShapeGrid shapes={filteredShapes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
