
export const findMin = (array) => {
    if (!array)
        return undefined;
    if (!array.length)
        return undefined;
    let min = array[0];
    array.forEach(element => {
        if (min > element)
            min = element;
    });
    return min;
}

export const findMax = (array) => {
    if (!array)
        return undefined;
    if (!array.length)
        return undefined;
    let max = array[0];
    array.forEach(element => {
        if (max < element)
            max = element;
    });
    return max;
}

export const clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num
}
