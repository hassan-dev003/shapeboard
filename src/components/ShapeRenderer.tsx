interface ShapeRendererProps {
    shape: "circle" | "square" | "triangle";
    color: string;
    size?: number;
}

// renders a colored svg shape with a drop shadow
export default function ShapeRenderer({
    shape,
    color,
    size = 64,
}: ShapeRendererProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
            </defs>

            {shape === "circle" && (
                <circle cx="50" cy="50" r="45" fill={color} filter="url(#drop-shadow)" />
            )}

            {shape === "square" && (
                <rect x="5" y="5" width="90" height="90" fill={color} filter="url(#drop-shadow)" />
            )}

            {shape === "triangle" && (
                <polygon points="50,5 95,95 5,95" fill={color} filter="url(#drop-shadow)" />
            )}
        </svg>
    );
}
