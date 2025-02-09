import { FormatDateParams } from "../../types/types";

export function formatCummulativeHelper({ years }: FormatDateParams = {}): string {
    if (Array.isArray(years)) {
        if (years.length === 0) {
            return 'Loading recent cummulatives';
        } else {
            return `Loading years: ${years.join(", ")}`;
        }
    }

    return "Loading recent cummulatives";
}