export function anArray<T>(length: number, builder: () => T): T[] {
    return Array.from({length}, builder);
}

export function DESC(a: number, b: number) {
    return a > b ? -1 : 1
}

export function ASC(a: number, b: number) {
    return a < b ? -1 : 1
}

export function sortAsc<T>(input: T[]) {
    return input.sort((a, b) =>
        a === b ? 0 : (a > b ? 1 : -1));
}

export function without<T>(input: T[], without: T[]) {
    const remove = new Set(without);
    const output: T[] = [];
    input.forEach(item => remove.has(item) || output.push(item));

    return output;
}

export function append<T>(input: T[] | undefined, add: T): T[] {
    if (!input) {
        input = [];
    }
    input.push(add);
    return input;
}

export function midPointValue<T>(input: T[]): T {
    const index = Math.floor(input.length / 2);
    return input[index];
}

export function changeIndex<T>(input: T[], from: number, to: number) {
    const next = [...input];
    const move = next.splice(from, 1);
    next.splice(to, 0, ...move);

    return next;
}