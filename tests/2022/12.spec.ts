import { neighbours, readInputFrom, toGrid, ASC } from '../__fixtures__';

describe('12', function () {
    const inputData = readInputFrom(2022, 12, 'input');
    const sampleData = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
    const alpha = new Map<string, number>([
        ...Array.from('abcdefghijklmnopqrstuvwxyz', (letter, index): [string, number] => [letter, index]),
        ['S', 0],
        ['E', 25],
    ]);

    type Cell = {
        x: number;
        y: number;
        id: string;
        value: number;
        route?: Route;
        neighbours: Set<Cell>;
        toRoutes(): Route[];
        toString(): string;
    }

    function cell(letter: string, x: number, y: number): Cell {
        const value = alpha.get(letter)!;
        const neighbours = new Set<Cell>();

        return {
            id: `${x}:${y}`,
            value,
            neighbours,
            route: undefined,
            x,
            y,
            toRoutes () {
                return Array.from(
                    neighbours,
                    (neighbour) => neighbour.route = new Route(new Set([this, neighbour]), neighbour, 1)
                );
            },
            toString() {
                return String(value);
            },
        }
    }

    class Route {
        constructor(public cells: Set<Cell>, public head: Cell, public count: number) {
        }

        walkTo(end: Cell, active: Set<Route>, complete: Set<Route>, winner?: Route) {
            active.delete(this);

            // when the head of the route is the end, the route is complete.
            if (this.head === end) {
                this.cells.clear();
                complete.add(this);
                return;
            }

            // if there is a completed route with a lower than this route, this cannot be the best route
            if (winner && winner.count <= this.count) {
                return;
            }

            for (const neighbour of this.head.neighbours) {
                // don't use a cell that has already been used
                if (this.cells.has(neighbour)) {
                    continue;
                }

                // if there's a faster way to get to that neighbour, this cannot be the route
                if (neighbour.route && neighbour.route.count < this.count) {
                    continue;
                }

                // deactivate the neighbour's route
                neighbour.route && active.delete(neighbour.route);

                // and set this route as the neighbour's route
                active.add(
                    neighbour.route = new Route(new Set([...this.cells, neighbour]), neighbour, this.count + 1)
                );
            }
        }
    }

    function parseInput(input: string) {
        let start: Cell | undefined;
        let end: Cell | undefined;

        const grid = toGrid(
            input,
            (letter, x, y) => {
                const c = cell(letter, x, y);
                letter === 'S' && (start = c);
                letter === 'E' && (end = c);
                return c;
            });

        if (!start || !end) {
            throw new Error('Unable to find the start/end');
        }

        const cells = grid.flat();
        cells.forEach(cell => {
            neighbours(cell.x, cell.y, grid, false).forEach(
                n => (n.value <= cell.value + 1) && cell.neighbours.add(n)
            );
        });

        return {
            grid,
            height: grid.length,
            width: grid[0]?.length || 0,
            cells,
            start,
            end,
            reset () {
                cells.forEach(c => delete c.route);
            }
        };
    }

    function getRoute(start: Cell, end: Cell, throws = true) {
        let complete = new Set<Route>();
        let active = new Set<Route>(start.toRoutes());
        let winner: Route | undefined;

        do {
            const next = new Set([...active]);
            let slice = 0;
            for (const route of active) {
                next.has(route) && route.walkTo(end, next, complete, winner);
                if (slice++ > 50) {
                    break;
                }
            }

            active = new Set([...next].sort((a, b) => ASC(a.count, b.count)));

            complete.forEach(route => {
                if (!winner || route.count < winner.count) {
                    winner = route;
                }
            });

            complete = new Set();

        } while (active.size > 0);

        if (!winner && throws) {
            throw new Error('Did not find a complete route');
        }

        return winner;
    }

    it('eg1', () => {
        const parsed = parseInput(sampleData);

        expect(getRoute(parsed.start, parsed.end)!.count).toBe(31);
    });

    it('q1', () => {
        const parsed = parseInput(inputData);

        expect(getRoute(parsed.start, parsed.end)!.count).toBe(481);
    });

    it('q2', () => {
        const parsed = parseInput(inputData);
        const starts = parsed.cells.filter(c => !c.value);
        let best: Route | undefined;

        starts.forEach(start => {
            parsed.reset();
            const route = getRoute(start, parsed.end, false);

            if (route && (!best ||best.count > route.count)) {
                console.log(`best(%s)`, route.count);
                best = route;
            }
        });

        console.log(best)
    });
});