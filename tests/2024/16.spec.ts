import {append, appendItem, Cell, COMPASS, Point, pointIs, pointKey, readInputFrom, toTabular} from "../__fixtures__";


describe('16', () => {
    const EXAMPLE = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
    `;

    type Chars = 'S' | 'E' | '.' | '#';
    type Grid = Array<Array<Node>>;

    type Node = Cell<Chars>;

    type StepOption = { to: Node | undefined, facing: Point, rotate: boolean };
    type StepValidOption = StepOption & { to: Node };

    function validOptions(...options: Array<StepOption>): StepValidOption[] {
        return options.filter(isValidOption);
    }

    function isValidOption(opt: StepOption): opt is StepValidOption {
        return !!opt.to && opt.to.data !== '#';
    }

    function stepOptions(grid: Grid, from: Node, facing: Point) {
        switch (true) {
            case pointIs(facing, COMPASS.E):
                return validOptions(
                    {to: grid[from.y][from.x + 1], facing: COMPASS.E, rotate: false},
                    {to: grid[from.y - 1]?.[from.x], facing: COMPASS.N, rotate: true},
                    {to: grid[from.y + 1]?.[from.x], facing: COMPASS.S, rotate: true},
                );
            case pointIs(facing, COMPASS.W):
                return validOptions(
                    {to: grid[from.y][from.x - 1], facing: COMPASS.W, rotate: false},
                    {to: grid[from.y - 1]?.[from.x], facing: COMPASS.N, rotate: true},
                    {to: grid[from.y + 1]?.[from.x], facing: COMPASS.S, rotate: true},
                );
            case pointIs(facing, COMPASS.N):
                return validOptions(
                    {to: grid[from.y][from.x + 1], facing: COMPASS.E, rotate: true},
                    {to: grid[from.y][from.x - 1], facing: COMPASS.W, rotate: true},
                    {to: grid[from.y - 1]?.[from.x], facing: COMPASS.N, rotate: false},
                );
            case pointIs(facing, COMPASS.S):
                return validOptions(
                    {to: grid[from.y][from.x + 1], facing: COMPASS.E, rotate: true},
                    {to: grid[from.y][from.x - 1], facing: COMPASS.W, rotate: true},
                    {to: grid[from.y + 1]?.[from.x], facing: COMPASS.S, rotate: false},
                );
            default:
                throw new Error(`Unknown facing point`);
        }
    }

    function parse(input: string) {
        let start: Node | undefined;
        let finish: Node | undefined;

        const t = toTabular<Node, Chars>(input.trim(), (from, x, y) => {
            switch (from as Chars) {
                case 'S':
                    return start = new Cell(x, y, from);
                case 'E':
                    return finish = new Cell(x, y, from);
                default:
                    return new Cell(x, y, from);
            }
        });

        if (!start || !finish) {
            throw new Error('Did not find the bounds');
        }

        let tails: Tail[] = [
            {
                cells: new Set([start]),
                head: start,
                facing: COMPASS.E,
                score: 0,
                tails: [],
            }
        ];

        const winners: Tail[] = [];
        const lowestAt: { [key: string]: Tail } = {};

        function addWinner(tail: Tail) {
            if (winners.length > 0 && winners[0].score > tail.score) {
                winners.length = 0;
            }
            if (!winners.length || winners[0].score === tail.score) {
                winners.push(tail);
            }
        }

        while (tails.length) {
            const next: Tail[] = [];
            tails.forEach(tail => {
                if (tail.head === finish) {
                    return addWinner(tail);
                }

                stepOptions(t.grid, tail.head, tail.facing).forEach(option => {
                    if (tail.cells.has(option.to)) {
                        return;
                    }

                    const nextTail: Tail = {
                        cells: new Set([...tail.cells, option.to]),
                        head: option.to,
                        facing: option.facing,
                        score: tail.score + (option.rotate ? 1001 : 1),
                        tails: [...tail.tails],
                    };
                    const key = pointKey(option.to) + ':' + pointKey(option.facing);

                    if (!lowestAt[key] || lowestAt[key].score > nextTail.score) {
                        lowestAt[key] = appendItem(next, nextTail);
                    } else if (lowestAt[key].score === nextTail.score) {
                        append(lowestAt[key].tails, nextTail);
                    }
                });
            });
            tails = next;
        }

        return {
            get lowest() {
                return winners[0]?.score || -1
            },
            get goodSeats() {
                return new Set(winners.flatMap(toCells)).size;
            },
        }
    }

    function toCells(tail: Tail): Node[] {
        return [...tail.cells, ...tail.tails.flatMap(toCells)];
    }

    type Tail = {
        cells: Set<Node>;
        head: Node;
        facing: Point;
        score: number;
        tails: Tail[];
    };

    it('example.1', () => {
        expect(parse(EXAMPLE).lowest).toBe(11048);
    })
    it('example.2', () => {
        expect(parse(EXAMPLE).goodSeats).toBe(64);
    });
    it('question.1', () => {
        expect(parse(readInputFrom(2024, 16)).lowest).toBe(98520);
    });
    it('question.2', () => {
        expect(parse(readInputFrom(2024, 16)).goodSeats).toBe(609);
    });
})