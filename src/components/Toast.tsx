"use client";

import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const isSuccess = type === "success";

    return (
        <div
            className="toast-enter"
            style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                borderLeft: `4px solid ${isSuccess ? "#22c55e" : "#ef4444"}`,
                background: isSuccess ? "#f0fdf4" : "#fef2f2",
                color: isSuccess ? "#166534" : "#991b1b",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "0.875rem",
                zIndex: 50,
            }}
        >
            <span>{message}</span>
            <button
                onClick={onDismiss}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    fontSize: "1rem",
                    lineHeight: 1,
                    padding: "0 0.25rem",
                    opacity: 0.6,
                }}
                aria-label="Dismiss"
            >
                ✕
            </button>
        </div>
    );
}
