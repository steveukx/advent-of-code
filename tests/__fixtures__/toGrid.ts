function toNumber(from: string) {
    return +from;
}

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