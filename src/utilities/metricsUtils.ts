export const wattsPerKilo = (watts: number | undefined, weightKg: number | undefined | null): number => {
    if (typeof watts === 'number' && typeof weightKg === 'number' && weightKg !== 0) {
        const result = watts / weightKg;
        return Math.round(result * 10) / 10; // rounding to 1 decimal place
    }
    return 0.0;
}
