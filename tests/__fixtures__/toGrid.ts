function toNumber(from: string) {
    return +from;
}

export type Grid<T> = Array<T>[];

export function toGrid<T extends any = number>(input: string, parser: (from: string, x: number, y: number) => T) {
    return input.split('\n')
        .map((line, y) =>
            line.split('').map((char, x) => parser(char, x, y)));
}

export function toNumberGrid(input: string) {
    return toGrid(input, toNumber);
}

export function fromGrid<T>(input: T[][], cellGlue = '', rowGlue = '\n') {
    return input.map(row => row.join(cellGlue)).join(rowGlue);
}

export function toTabular<T extends any = number>(input: string, parser: (from: string, x: number, y: number) => T) {
    const rows: T[][] = [];
    const cols: T[][] = [];
    const grid = toGrid(input, (from, x, y) => {
        if (y >= rows.length) { rows.push([]) }
        if (x >= cols.length) { cols.push([]) }

        const parsed = parser(from, x, y);
        cols[x].push(parsed);
        rows[y].push(parsed);

        return parsed;
    });

    return {
        rows,
        cols,
        grid,
        width: cols.length,
        height: rows.length,
    };
}

export function identity<T>(input: T) {
    return input;
}

export class Cell<T> {
    public readonly key: string;
    constructor(public readonly x: number, public readonly y: number, public readonly data: T) {
        this.key = `${x}:${y}`;
    }
}