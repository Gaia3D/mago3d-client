export const getLengthUnitFactor = (unit: string): number => {
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

export const getAreaUnitFactor = (unit: string) => {
    switch(unit) {
        case "m²": return 1;
        case "km²": return 1000000;
        case "yd²": return 0.836127;
        case "mi²": return 2589988.11;
        case "acre": return 4046.865;
        case "ha": return 10000;
        default: return 1;
    }
}
