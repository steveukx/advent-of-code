import { Cell, readInputFrom, toTabular } from '../__fixtures__';

describe('06', () => {
    const EXAMPLE = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`.trim();

    type Node = Cell<'.' | '#'>;

    function parse(input: string) {
        let start: Node;
        const t = toTabular<Node>(input.trim(), (from, x, y) => {
            if (from === '^') {
                return (start = new Cell(x, y, '.'));
            }
            return new Cell(x, y, from === '#' ? from : '.');
        });

        if (!start) {
            throw new Error('No start point found');
        }

        function walk(blockage: Node | null = null) {
            const steps = new Set<string>();
            const path = new Set<Node>();
            let from = start;
            let dX = 0, dY = -1;

            while (from) {
                const motion = `${dX}:${dY}:${from.key}`;
                if (steps.has(motion)) {
                    throw new Error('Loop detected');
                }
                steps.add(motion);
                path.add(from);

                const next = t.cols?.[from.x + dX]?.[from.y + dY];

                if (next?.data === '#' || next === blockage) {
                    const [rX, rY] = rotate(dX, dY);
                    dX = rX;
                    dY = rY;
                    continue;
                }

                from = next;
            }

            return path;
        }

        function loops() {
            const options = walk();
            options.delete(start);

            const found: Node[] = [];
            for (const option of options) {
                try {
                    walk(option);
                }
                catch (e) {
                    found.push(option);
                }
            }

            return found;
        }

        return {
            loops,
            walk,
            t,
            start
        }
    }

    function rotate(x: number, y: number) {
        if (!x) {
            return y > 0 ? [-1, 0] : [1, 0];
        }
        return x > 0 ? [0, 1] : [0, -1];
    }

    it('example.1', () => {
        const steps = parse(EXAMPLE).walk();

        expect(steps.size).toBe(41)
    });

    it('example.2', () => {
        const steps = parse(EXAMPLE).loops();

        expect(steps.length).toBe(6)
    });

    it('question.1', () => {
        const steps = parse(readInputFrom(2024, 6)).walk();

        expect(steps.size).toBe(4967);
    });

    it('question.2', () => {
        const steps = parse(readInputFrom(2024, 6)).loops();

        expect(steps.length).toBe(1789);
    });
})