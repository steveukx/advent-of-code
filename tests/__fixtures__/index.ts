import { readFileSync } from 'fs';
import { resolve } from 'path';

export * from './assertions';
export { toNumberGrid, toGrid } from './toGrid';
export { neighbours } from './neighbours';

type InputDataKind = 'sample' | 'input';

function filePath(year: number, day: number, kind: InputDataKind) {
    return resolve(__dirname, 'data', `${year}-${String(day).padStart(2, '0')}.${kind}.txt`);
}

export function readInputFrom(year: number, day: number, kind: InputDataKind) {
    return readFileSync(filePath(year, day, kind), 'utf8');
}

export function toLines(input: string): string[] {
    return input.trimEnd().split('\n');
}

export function anArray<T>(length: number, builder: () => T): T[] {
    return Array.from({length}, builder);
}

export function sum(...numbers: Array<string | number>) {
    return sumOf(numbers);
}

export function sumOf(numbers: Array<string | number>) {
    return numbers.reduce((count: number, item) => {
        return count + (parseInt(String(item), 10) || 0);
    }, 0);
}

export function productOf(numbers: Array<number>) {
    return numbers.reduce((count: number, item) => count * item);
}

export const factorial = Object.assign(function (distance: number) {
    if (!factorial.cache.has(distance)) {
        factorial.cache.set(distance, Array(distance).fill(0).reduce((result, _, index) => result + index + 1, 0));
    }

    return factorial.cache.get(distance)!;
}, {
    cache: new Map<number, number>()
});

export function without<T>(input: T[], without: T[]) {
    const remove = new Set(without);
    const output: T[] = [];
    input.forEach(item => remove.has(item) || output.push(item));

    return output;
}

export function onlyIn<T>(input: T[]): T {
    expect(input).toHaveLength(1);
    return input[0];
}

export enum Range {
    BELOW,
    WITHIN,
    ABOVE,
}

export function withinRange(min: number, max: number, test: number) {
    if (test < min) {
        return Range.BELOW;
    }

    if (test > max) {
        return Range.ABOVE;
    }

    return Range.WITHIN;
}