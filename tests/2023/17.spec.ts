import { Cell, readInputFrom, toTabular } from '../__fixtures__';

describe('17', function () {
    const INPUT = readInputFrom(2023, 17, 'input');
    const EXAMPLE = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

    function builder(x: number, y: number) {
        const N = `${x}:${y-1}`;
        const S = `${x}:${y+1}`;
        const W = `${x-1}:${y}`;
        const E = `${x+1}:${y}`;

        function next (fromX: number, fromY: number) {
            if (fromY < y) return [E, S, W];
            if (fromX > x) return [S, W, N];
            if (fromY > y) return [W, N, E];
            if (fromX < x) return [N, E, S];
            return [W, N, E, S];
        }

        function valid(chain: Cell<unknown>[]) {
            const a = chain.at(-1);
            const b = chain.at(-2);
            const c = chain.at(-3);

            if (!a || !b || !c) {
                return true;
            }

            return !((y === a.y && y === b.y && y === c.y) || (x === a.x && x === b.x && x === c.x));
        }

        return {
            next,
            valid,
        };
    }

    type GridCell = Cell<number> & ReturnType<typeof builder>;

    const data = (input: string) => {
        const cells = new Map<string, GridCell>();
        const {width, height} = toTabular(input, (node, x, y) => {
            const cell = Object.assign(new Cell(x, y, Number(node)), builder(x, y));
            cells.set(cell.key, cell);

            return cell;
        });

        return {
            width,
            height,
            cells,
            nw: cells.get('0:0')!,
            se: cells.get(`${width - 1}:${height - 1}`)!,
        }
    };

    function walk(
        cells: Map<string, GridCell>,
        origin: GridCell,
        terminus: GridCell,
    ) {
        const seen = new Map<GridCell, Set<string>>();
        const queue: Array<{ cell: GridCell, fromX: number, fromY: number; chain: GridCell[], sum: number }> = [{ cell: origin, fromX: 0, fromY: 0, chain: [], sum: 0 }];
        let finish = 0;

        while (queue.length) {
            if (queue.length > 5000) {
                debugger;
            }
            const {cell, fromX, fromY, sum, chain} = queue.shift()!;
            if (!cell) {
                // not a real cell ID
                continue;
            }
            if (finish && sum > finish) {
                // already finished and this chain is longer
                continue;
            }
            if (cell === terminus) {
                finish = finish ? Math.min(finish, sum) : sum;
                if (finish === sum) {
                    debugger;
                }
                continue;
            }

            const from = seen.get(cell) || new Set();
            seen.set(cell, from);

            if (from.has(`${fromX}:${fromY}`)) {
                // debugger;
                continue;
            }

            from.add(`${fromX}:${fromY}`);

            for (const next of cell.next(fromX, fromY)) {
                const nextCell = cells.get(next);
                if (!nextCell) {
                    continue;
                }

                if (!nextCell.valid(chain)) {
                    continue;
                }

                queue.push({
                    cell: nextCell,
                    fromX: cell.x,
                    fromY: cell.y,
                    sum: sum + cell.data,
                    chain: [...chain, nextCell],
                });
            }
        }

        return finish;
    }

    // const energised = (cells: Map<string, GridCell>, origin: { cell?: GridCell, fromX: number, fromY: number }) => {
    //     const seen = new Map<GridCell, Set<string>>();
    //
    //     const queue = [origin];
    //     while (queue.length) {
    //         const {cell, fromX, fromY} = queue.shift()!;
    //         if (!cell) {
    //             continue;
    //         }
    //
    //         const from = seen.get(cell) || new Set();
    //         seen.set(cell, from);
    //
    //         if (from.has(`${fromX}:${fromY}`)) {
    //             continue;
    //         }
    //
    //         from.add(`${fromX}:${fromY}`);
    //
    //         for (const next of cell.next(fromX, fromY)) {
    //             const nextCell = cells.get(next);
    //             if (!nextCell) {
    //                 continue;
    //             }
    //
    //             queue.push({
    //                 cell: nextCell,
    //                 fromX: cell.x,
    //                 fromY: cell.y,
    //             });
    //         }
    //     }
    //
    //     return seen.size;
    // };

    // function parseB(input: string) {
    //     let count = -1;
    //     const {height, width, cells} = data(input);
    //     for (let x = 0; x < width; x++) {
    //         count = Math.max(
    //             count,
    //             energised(cells, {
    //                 cell: cells.get(`${x}:0`),
    //                 fromY: -1,
    //                 fromX: x,
    //             }),
    //             energised(cells, {
    //                 cell: cells.get(`${x}:${height - 1}`),
    //                 fromY: height,
    //                 fromX: x,
    //             }),
    //         )
    //     }
    //     for (let y = 0;y < height; y++) {
    //         count = Math.max(
    //             count,
    //             energised(cells, {
    //                 cell: cells.get(`0:${y}`),
    //                 fromY: y,
    //                 fromX: -1,
    //             }),
    //             energised(cells, {
    //                 cell: cells.get(`${width - 1}:${y}`),
    //                 fromY: y,
    //                 fromX: width,
    //             }),
    //         )
    //     }
    //
    //     return count;
    // }

    function parseA(input: string) {
        const {cells, nw, se} = data(input);

        return walk(cells, nw, se);
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