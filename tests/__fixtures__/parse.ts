import {readFileSync} from "fs";
import {resolve} from "path";

const trim = String.prototype.trim.call.bind(String.prototype.trim) as (input: string) => string;

type InputDataKind = 'sample' | 'input';

function filePath(year: number, day: number, kind: InputDataKind) {
    return resolve(__dirname, 'data', `${year}-${String(day).padStart(2, '0')}.${kind}.txt`);
}

export function readInputFrom(year: number, day: number, kind: InputDataKind = 'input') {
    return readFileSync(filePath(year, day, kind), 'utf8');
}

export function toLines(input: string, { trimStart, trimEnd } = { trimStart: true, trimEnd: true }): string[] {
    let out = trimEnd ? input.trimEnd() : input;
    if (trimStart) {
        out = out.trimStart();
    }
    return out.split('\n');
}

export function toStringArray(input: string, trimmed = true, split = '\n') {
    let output = (trimmed ? input.trim() : input).split(split);
    return trimmed ? output.map(trim) : output;
}
