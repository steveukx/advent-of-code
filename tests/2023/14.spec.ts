import { neighbours, readInputFrom, sumOf, toGrid, toLines } from '../__fixtures__';
import { Cell, fromGrid, Grid, identity, toTabular } from '../__fixtures__/toGrid';

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

    function tilt(input: string) {
        const { height, width } = toTabular(input, identity);

        const flat = input.replace(/\n/g, '');
        const rows = Array.from(asRows(flat, width, height));
        const cols = Array.from(asColumns(flat, width, height));

        debugger;
    }

    function parse(input: string) {
        const {cols} = toTabular(input, identity);
        const tilted = cols.map(col => {
            const blobs = col.join('').split('#').map(blob => {
                const length = blob.length;
                const rocks = blob.replace(/\./g, '').padEnd(length, '.');

                return rocks;
            }).join('#').split('');

           return blobs;
        });
        const scores = tilted.map(col => {
            const max = col.length;
            return col.reduceRight((score, cell, index) => {
                if (cell === 'O') {
                    return score + (max - index);
                }

                return score;
            }, 0);
        })

        return {
            cols,
            tilted,
            scores,
            score: sumOf(scores),
        };
    }

    it('ex1', () => {
        tilt(EXAMPLE)
        expect(parse(EXAMPLE).score).toBe(136);
    })

    it('ex2 a', () => {
        const parsed = parse(EXAMPLE);
        const borders = new Set(
            path(parsed).map(c => c.key)
        );
        const enc = enclosure(parsed, borders);

        expect(enc.size).toBe(1);
    });

    it('ex2 b', () => {
        const parsed = parse(INPUT);
        // const borders = new Set(
        //     path(parsed).map(c => c.key)
        // );
        // const enc = enclosure(parsed, borders);


        console.log(
            fromGrid(
                redraw(parsed, new Set(path(parsed)))
            )
        )


    })

    it('q1', () => {
        console.log(parse(INPUT).score);
    });

    it('q2', () => {
        const parsed = parse(INPUT);
        const borders = new Set(
            path(parsed).map(c => c.key)
        );
        const enc = enclosure(parsed, borders);

        console.log(enc.size);
    });
});