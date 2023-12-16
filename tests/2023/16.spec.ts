import { Cell, readInputFrom, toTabular } from '../__fixtures__';

describe('16', function () {
    const INPUT = readInputFrom(2023, 16, 'input');
    const EXAMPLE = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

    function builder(x: number, y: number, type: string) {
        function passThrough(x2: number, y2: number) {
            return x2 === x ? [`${x}:${y2 > y ? y - 1 : y + 1}`] : [`${x2 > x ? x - 1 : x + 1}:${y}`];
        }

        switch (type) {
            case '.':
                return passThrough;
            case '|':
                return function (x2: number, y2: number) {
                    return x2 === x ? passThrough(x2, y2) : [`${x}:${y - 1}`, `${x}:${y + 1}`];
                };
            case '-':
                return function (x2: number, y2: number) {
                    return x2 !== x ? passThrough(x2, y2) : [`${x - 1}:${y}`, `${x + 1}:${y}`];
                };
            case '\\':
                return function (x2: number, y2: number) {
                    if (x === x2) {
                        return y2 < y ? [`${x + 1}:${y}`] : [`${x - 1}:${y}`];
                    }
                    return x2 < x ? [`${x}:${y + 1}`] : [`${x}:${y - 1}`];
                };
            case '/':
                return function (x2: number, y2: number) {
                    if (x === x2) {
                        return y2 < y ? [`${x - 1}:${y}`] : [`${x + 1}:${y}`];
                    }
                    return x2 < x ? [`${x}:${y - 1}`] : [`${x}:${y + 1}`];
                };
            default:
                throw new Error(`Unknown type: "${type}"`);
        }
    }

    type GridCell = Cell<string> & { next: ReturnType<typeof builder> };

    const data = (input: string) => {
        const cells = new Map<string, GridCell>();
        const {width, height} = toTabular(input, (node, x, y) => {
            const cell = Object.assign(new Cell(x, y, node), {next: builder(x, y, node)});
            cells.set(cell.key, cell);

            return cell;
        });

        return {
            width, height, cells
        }
    };

    const energised = (cells: Map<string, GridCell>, origin: { cell?: GridCell, fromX: number, fromY: number }) => {
        const seen = new Map<GridCell, Set<string>>();

        const queue = [origin];
        while (queue.length) {
            const {cell, fromX, fromY} = queue.shift()!;
            if (!cell) {
                continue;
            }

            const from = seen.get(cell) || new Set();
            seen.set(cell, from);

            if (from.has(`${fromX}:${fromY}`)) {
                continue;
            }

            from.add(`${fromX}:${fromY}`);

            for (const next of cell.next(fromX, fromY)) {
                const nextCell = cells.get(next);
                if (!nextCell) {
                    continue;
                }

                queue.push({
                    cell: nextCell,
                    fromX: cell.x,
                    fromY: cell.y,
                });
            }
        }

        return seen.size;
    };

    function parseB(input: string) {
        let count = -1;
        const {height, width, cells} = data(input);
        for (let x = 0; x < width; x++) {
            count = Math.max(
                count,
                energised(cells, {
                    cell: cells.get(`${x}:0`),
                    fromY: -1,
                    fromX: x,
                }),
                energised(cells, {
                    cell: cells.get(`${x}:${height - 1}`),
                    fromY: height,
                    fromX: x,
                }),
            )
        }
        for (let y = 0;y < height; y++) {
            count = Math.max(
                count,
                energised(cells, {
                    cell: cells.get(`0:${y}`),
                    fromY: y,
                    fromX: -1,
                }),
                energised(cells, {
                    cell: cells.get(`${width - 1}:${y}`),
                    fromY: y,
                    fromX: width,
                }),
            )
        }

        return count;
    }

    function parseA(input: string) {
        const {cells} = data(input);
        return energised(cells, {cell: cells.get('0:0'), fromX: -1, fromY: 1});
    }

    it('ex1', () => {
        expect(parseA(EXAMPLE)).toBe(46)
    });

    it('ex2', () => {
        expect(parseB(EXAMPLE)).toBe(51);
    });

    it('q1', () => {
        console.log(parseA(INPUT));
    })

    it('q2', () => {
        console.log(parseB(INPUT));
    })
});