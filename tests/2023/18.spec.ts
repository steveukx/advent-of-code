import { Cell, readInputFrom, toLines } from '../__fixtures__';

describe('17', function () {
    const INPUT = readInputFrom(2023, 17, 'input');
    const EXAMPLE = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

    function parseA(input: string) {
        let x = 0;
        let y = 0;
        const plan = {
            n: 0,
            s: 0,
            w: 0,
            e: 0,
        };
        const cells = new Map<string, Cell<string>>();

        const move = (direction: 'U' | 'D' | 'L' | 'R' | unknown, distance: number, hex: string) => {
            const prev = cells.get(`${x}:${y}`);

            switch (direction) {
                case 'U':
                    plan.n = Math.min(plan.n, y - distance);
                    return new Cell(x, y = y - distance, hex);
                case 'D':
                    plan.s = Math.max(plan.s, y + distance);
                    return new Cell(x, y = y + distance, hex);
                case 'L':
                    plan.w = Math.min(plan.w, x - distance);
                    return new Cell(x = x - distance, y, hex);
                case 'R':
                    plan.e = Math.max(plan.e, x + distance);
                    return new Cell(x = x + distance, y, hex);
                default:
                    throw new Error('Unknown direction: ' + direction);
            }
        }

        toLines(input).forEach(line => {
            const [, direction, distance, hex] = /([UDLR]) (\d+) \((#[a-f0-9]+)/.exec(line)!;
            const cell = move(direction, Number(distance), hex);
            cells.set(cell.key, cell);
        });

        debugger;
    }

    it('ex1', () => {
        expect(parseA(EXAMPLE)).toBe(102)
    });

    it('ex2', () => {

    });

    it('q1', () => {
        console.log(parseA(INPUT));
    })

    it('q2', () => {

    })
});