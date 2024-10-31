export function colorRamp(startColor, middleColor, endColor, steps) {
    // Parse hex colors to RGB
    const start = hexToRgb(startColor);
    const middle = hexToRgb(middleColor);
    const end = hexToRgb(endColor);

    // Calculate steps for each gradient section
    const halfSteps = Math.floor(steps / 2);
    const remainingSteps = steps - halfSteps;

    // Calculate color steps for start to middle and middle to end
    const step1 = {
        r: (middle.r - start.r) / (halfSteps - 1),
        g: (middle.g - start.g) / (halfSteps - 1),
        b: (middle.b - start.b) / (halfSteps - 1),
    };
    const step2 = {
        r: (end.r - middle.r) / (remainingSteps - 1),
        g: (end.g - middle.g) / (remainingSteps - 1),
        b: (end.b - middle.b) / (remainingSteps - 1),
    };

    // Generate color ramp
    const colors = [];
    for (let i = 0; i < halfSteps; i++) {
        const r = Math.round(start.r + step1.r * i);
        const g = Math.round(start.g + step1.g * i);
        const b = Math.round(start.b + step1.b * i);
        colors.push({ r, g, b });
    }
    for (let i = 0; i < remainingSteps; i++) {
        const r = Math.round(middle.r + step2.r * i);
        const g = Math.round(middle.g + step2.g * i);
        const b = Math.round(middle.b + step2.b * i);
        colors.push({ r, g, b });
    }

    return colors;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}