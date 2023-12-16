import { reduce } from 'lodash';
import { readInputFrom, sumOf, toTabular } from '../__fixtures__';

describe('14', function () {
    const INPUT = readInputFrom(2023, 14, 'input');
    const EXAMPLE = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

    type TiltFunction<R = string> = (flat: string, width: number, height: number) => R;
    type FlattenFunction = (src: string[], width: number, height: number) => string;
    type SliceGenerator = (input: string, width: number, height: number) => Generator<string, void, unknown>

    function* asRows(input: string, width: number, height: number) {
        for (let y = 0; y < height; y++) {
            const start = y * width;
            yield input.substring(start, start + width);
        }
    }

    function* asColumns(input: string, width: number, height: number) {
        let x = 0;

        while (x < width) {
            let out = '';
            for (let y = 0; y < height; y++) {
                out += input.charAt(y * width + x);
            }
            yield out;
            x++;
        }
    }

    const generateTilt = (asSlices: SliceGenerator, asFlat: FlattenFunction, forward: boolean): TiltFunction => {
        return (flat, width, height) => {
            return asFlat(
                Array.from(asSlices(flat, width, height), (slice) => {
                    return slice.split('#').map(blob => {
                        const length = blob.length;
                        const rocks = blob.replace(/\./g, '');

                        return forward ? rocks.padStart(length, '.') : rocks.padEnd(length, '.');
                    }).join('#');
                }),
                width,
                height,
            );
        };
    }

    const flattenRows: FlattenFunction = (rows) => {
        return rows.join('');
    }

    const flattenCols: FlattenFunction = (cols, width, height) => {
        let out = '';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                out += cols[x][y];
            }
        }
        return out;
    }

    const tilts = [
        generateTilt(asColumns, flattenCols, false),
        generateTilt(asRows, flattenRows, false),
        generateTilt(asColumns, flattenCols, true),
        generateTilt(asRows, flattenRows, true),
    ];

    const SCORE: TiltFunction<number> = (input, width, height) => {
        return sumOf(
            Array.from(asRows(input, width, height), (row, index) => {
                return row.replace(/[^O]/g, '').length * (height - index);
            }),
        );
    }

    function parseA(input: string) {
        let flat = '';
        const {height, width} = toTabular(input, chr => void (flat += chr));

        const result = tilts[0](flat, width, height);
        return SCORE(result, width, height);
    }

    function parseB(input: string) {
        let flat = '';
        const {height, width} = toTabular(input, chr => void (flat += chr));
        const results = new Map();
        const steps = [];

        for (let i = 0, before = flat; i < 1000; i++) {
            steps.push(before);
            const after = reduce(tilts, (chain, tilt) => tilt(chain, width, height), before);
            results.set(before, after);

            if (results.has(after)) {
                const start = steps.indexOf(after);
                const repetitions = (1000000000 - i - 1) % (i - start + 1) + start;

                return SCORE(steps[repetitions], width, height);
            }

            before = after;
        }

        throw new Error(`Unable to find repeat pattern`);
    }

    it('ex1', () => {
        expect(parseA(EXAMPLE)).toBe(136);
    })

    it('ex2', () => {
        expect(parseB(EXAMPLE)).toBe(64);
    });

    it('q1', () => {
        console.log(parseA(INPUT));
    });

    it('q2', () => {
        console.log(parseB(INPUT));
    });
});