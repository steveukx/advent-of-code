import { append, Cell, readInputFrom, toTabular } from '../__fixtures__';

describe('08', () => {
    const EXAMPLE = `
......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.`;

    type Node = Cell<string | null>;
    function parse(input: string, locator = locateNodesV1) {
        const antennae = new Map<string, Cell<string>[]>();
        const t = toTabular(input.trim(), (from, x, y) => {
            if (/[.#]/.test(from)) {
                return new Cell(x, y, null);
            }
            const ant = new Cell(x, y, from);
            antennae.set(from, append(antennae.get(from), ant));

            return ant;
        });
        const pairs = Array.from(antennae.values(), ( all) => toPairs(all)).flat();

        const anti: Set<Node> = pairs.reduce((found, pair) => {
            return (locator(pair, t.grid, found), found);
        }, new Set<Node>);

        return {
            pairs,
            anti,
            t,
        }
    }

    function locateNodeV2(pair: [Node, Node], grid: Node[][], found: Set<Node>) {
        const x = pair[0].x - pair[1].x;
        const y = pair[0].y - pair[1].y;

        function walk (from: Node, dX: number, dY: number) {
            let next = grid[from.y + y]?.[from.x + x];
            while (next) {
                found.add(next);
                next = grid[next.y + dY]?.[next.x + dX]
            }
        }

        walk(pair[0], x, y);
        walk(pair[1], -x, -y);
    }

    function locateNodesV1(pair: [Node, Node], grid: Node[][], found: Set<Node>) {
        const x = pair[0].x - pair[1].x;
        const y = pair[0].y - pair[1].y;
        const a = grid[pair[0].y + y]?.[pair[0].x + x];
        const b = grid[pair[1].y - y]?.[pair[1].x - x];

        a && found.add(a);
        b && found.add(b);
    }

    it('example.1', () => {
        expect(parse(EXAMPLE).anti.size).toBe(14);
    });
    it('question.1', () => {
        expect(parse(readInputFrom(2024, 8)).anti.size).toBe(361);
    });
    it('example.2', () => {
        expect(parse(EXAMPLE, locateNodeV2).anti.size).toBe(34);
    });
    it('question.2', () => {
        expect(parse(readInputFrom(2024, 8), locateNodeV2).anti.size).toBe(1249);
    });

    function toPairs<T>(input: T[]): Array<[T, T]> {
        return input.flatMap((left, index) => {
            return input.slice(index + 1).map(right => [left, right]);
        });
    }
})