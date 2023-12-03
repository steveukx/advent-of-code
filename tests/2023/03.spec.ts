import { neighbours, productOf, readInputFrom, sumOf, toGrid } from '../__fixtures__';

describe('03', function () {
    const INPUT = readInputFrom(2023, 3, 'input');
    const EXAMPLE = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

    function isNumCell(input: unknown): input is { value: string } {
        return typeof (input as any)?.value === 'string'
    }

    function parse(input: string) {
        const numbers: Map<string, { value: string }> = new Map();
        const symbols: Array<{ x: number, y: number, char: string }> = [];

        const grid = toGrid(input, (char, x, y) => {
            switch (char) {
                case '.':
                    return;
                case /\d/.test(char) && char:
                    const num = numbers.get(`${x - 1}:${y}`) || {value: ''};
                    num.value += char;
                    numbers.set(`${x}:${y}`, num);
                    return num;
                default:
                    return symbols[symbols.length] = {x, y, char};
            }
        });

        const adjacent = new Set(
            symbols.flatMap(symbol =>
                neighbours(symbol.x, symbol.y, grid, true).filter(isNumCell))
        );

        return sumOf(Array.from(adjacent.values(), ({value}) => parseInt(value, 10)));
    }

    function parseB(input: string) {
        const numbers: Map<string, { value: string }> = new Map();
        const gears: Array<{ x: number, y: number, char: string }> = [];

        const grid = toGrid(input, (char, x, y) => {
            switch (char) {
                case '.':
                    return;
                case /\d/.test(char) && char:
                    const num = numbers.get(`${x - 1}:${y}`) || {value: ''};
                    num.value += char;
                    numbers.set(`${x}:${y}`, num);
                    return num;
                case '*':
                    gears[gears.length] = {x, y, char};
                    return;
                default:
                    return;
            }
        });

        return sumOf(
            gears
                .map(gear => new Set(neighbours(gear.x, gear.y, grid, true).filter(isNumCell)))
                .filter(x => x.size === 2)
                .map(x =>
                    productOf(Array.from(x.values(), ({value}) => parseInt(value, 10)))
                )
        )
    }


    it('ex1', () => {
        const actual = parse(EXAMPLE);
        expect(actual).toBe(4361);
    })

    it('ex2', () => {
        const actual = parseB(EXAMPLE);
        expect(actual).toBe(467835);
    })

    it('q1', () => {
        console.log(parse(INPUT));
    });

    it('q2', () => {
        console.log(parseB(INPUT));
    });
});