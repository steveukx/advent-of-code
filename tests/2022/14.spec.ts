import { Range, toStringArray, withinRange } from '../__fixtures__';

type Cube = { y1: number; x1: number; y2: number; x2: number };
describe('14', function () {
    const sampleData = `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
    `;

    function* between (from: [number, number], to: [number, number]) {
        for (let x = Math.min(from[0], to[0]), xMax = Math.max(from[0], to[0]); x <= xMax; x++) {
            for (let y = Math.min(from[1], to[1]), yMax = Math.max(from[1], to[1]); y <= yMax; y++) {
                yield [x, y];
            }
        }
    }

    function can([x, y]: [number, number], cells: Map<string, string>): [number, number] | null {
        return cells.has(`${x}:${y}`) ? null : [x, y];
    }

    function drop(grain: [number, number], cube: Cube, cells: Map<string, string>) {
        if (withinRange(cube.x1, cube.x2, grain[0]) !== Range.WITHIN) {
            // no longer on the grid, to the void!
            return;
        }
        if (withinRange(cube.y1, cube.y2, grain[1]) !== Range.WITHIN) {
            // no longer on the grid, to the void!
            return;
        }

        const next = can([grain[0], grain[1] + 1], cells) ||
            can([grain[0] - 1, grain[1] + 1], cells) ||
            can([grain[0] + 1, grain[1] + 1], cells);

        if (next) {
            return drop(next, cube, cells);
        }

        cells.set(grain.join(':'), 'o');
    }

    function parse(input: string) {
        const cube: Cube = {
            x1: 500,
            x2: 500,
            y1: 0,
            y2: 0,
        };
        const cells = new Map<string, string>();

        toStringArray(input).forEach(line => {
            const steps = line.split(' -> ')
                .map(coord => coord.split(',').map(parseFloat) as [number, number]);

            steps.reduce((from, to) => {
                for (const [x, y] of between(from, to)) {
                    cells.set(`${x}:${y}`, '#');

                    if (x > cube.x1) cube.x1 = x;
                    if (x < cube.x2) cube.x2 = x;
                    if (y > cube.y1) cube.y1 = y;
                    if (y < cube.y2) cube.y2 = y;
                }
                return to;
            });
        });

        return {
            cube,
            cells,
        };
    }

    function sand(cube: Cube, cells: Map<string, string>) {
        const grain = [500, 0];

    }

    it('ex1', () => {
        parse(sampleData);
    });
});