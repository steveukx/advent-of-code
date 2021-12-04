import { readFileSync } from 'fs';
import { resolve } from 'path';

type InputDataKind = 'sample' | 'input';

function filePath (year: number, day: number, kind: InputDataKind) {
    return resolve(__dirname, 'data', `${year}-${String(day).padStart(2, '0')}.${kind}.txt`);
}

export function readInputFrom(year: number, day: number, kind: InputDataKind) {
    return readFileSync(filePath(year, day, kind), 'utf8');
}

export function anArray<T>(length: number, builder: () => T): T[] {
    return Array.from({ length }, builder);
}

export function sum (...numbers: Array<string | number>) {
    return numbers.reduce((count: number, item) => {
        return count + (parseInt(String(item), 10) || 0);
    }, 0);
}