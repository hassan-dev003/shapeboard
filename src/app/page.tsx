"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Shape } from "@/lib/types";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

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

    // subscribe to all changes on the shapes table so the grid stays in sync.
    // we just re-fetch the full list on any event.
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
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Shapeboard
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Live shape grid
        </p>

        {lastUpdated && (
          <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
            Last updated: {lastUpdated}
          </p>
        )}

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-zinc-500">Loading...</p>
          ) : (
            <ShapeGrid shapes={shapes} />
          )}
        </div>
      </div>
    </div>
  );
}
