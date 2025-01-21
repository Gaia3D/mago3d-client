export const getUnitFactor = (unit: string): number => {
    switch (unit) {
        case "m": return 1;
        case "km": return 1000;
        case "nmi": return 1852;
        case "in": return 0.0254;
        case "ft": return 0.3048;
        case "yd": return 0.9144;
        case "mi": return 1609.344;
        default: return 1;
    }
};