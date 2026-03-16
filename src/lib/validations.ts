import type { Shape } from "./types";

/** The set of shape values accepted by the application. */
const VALID_SHAPES = new Set<Shape["shape"]>([
    "circle",
    "square",
    "triangle",
]);

/** Matches a 7-character hex color string: '#' followed by exactly 6 hex digits. */
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validates only the fields that are present on a partial Shape object.
 *
 * Validation rules
 * ─────────────────
 * • name  – Must be a non-empty string with a maximum length of 100 characters.
 * • shape – Must be one of the allowed literals: "circle", "square", or "triangle".
 * • color – Must be a valid hex color string matching the pattern #RRGGBB
 *           (a '#' followed by exactly 6 hexadecimal characters, e.g. #FF0000).
 *
 * Fields that are `undefined` are silently skipped; only fields explicitly
 * provided on the input object are validated.
 */
export function validateShape(
    input: Partial<Pick<Shape, "name" | "shape" | "color">>,
): ValidationResult {
    const errors: string[] = [];

    // Rule: name must be a non-empty string, maximum 100 characters.
    if (input.name !== undefined) {
        if (typeof input.name !== "string" || input.name.trim().length === 0) {
            errors.push("Name must be a non-empty string.");
        } else if (input.name.length > 100) {
            errors.push("Name must not exceed 100 characters.");
        }
    }

    // Rule: shape must be one of exactly "circle", "square", or "triangle".
    if (input.shape !== undefined) {
        if (!VALID_SHAPES.has(input.shape as Shape["shape"])) {
            errors.push(
                `Shape must be one of: ${Array.from(VALID_SHAPES).join(", ")}.`,
            );
        }
    }

    // Rule: color must be a valid hex color string matching #RRGGBB (e.g. #FF0000).
    if (input.color !== undefined) {
        if (typeof input.color !== "string" || !HEX_COLOR_REGEX.test(input.color)) {
            errors.push(
                "Color must be a valid hex color string (e.g. #FF0000).",
            );
        }
    }

    return { valid: errors.length === 0, errors };
}
