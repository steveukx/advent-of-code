
export function neighbours<T>(x: number, y: number, array: T[][]): T[] {
    const out: T[] = [];
    const above = y > 0;
    const below = y < array.length - 1;
    const left = x > 0;
    const right = x < (array[y].length - 1);

    if (left) {
        out.push(array[y][x - 1]);
    }

    if (right) {
        out.push(array[y][x + 1]);
    }

    if (above) {
        out.push(...array[y - 1].slice(
            left ? x - 1 : x,
            right ? x + 2 : x + 1,
        ));
    }

    if (below) {
        out.push(...array[y + 1].slice(
            left ? x - 1 : x,
            right ? x + 2 : x + 1,
        ));
    }

    return out;
}