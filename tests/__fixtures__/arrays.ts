export function anArray<T>(length: number, builder: (index: number) => T): T[] {
    return Array.from({length}, (_, index) => builder(index));
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

export function removeItem<T>(input: T[], remove: T): T {
    let index = input.indexOf(remove);
    if (index >= 0) {
        input.splice(index, 1);
    }
    return remove;
}

export function appendItem<T>(input: T[], add: T, unique = false): T {
    if (!unique || !input.includes(add)) {
        input.push(add);
    }
    return add;
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