import {COMPASS, Point, pointAdd, pointKey, readInputFrom, sumOf, thePoint, toGrid, ZeroPoint} from "../__fixtures__";

describe('15', () => {

    const EXAMPLE = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`

    const EXAMPLE_A = `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
    `;

    class Node {
        static WIDE = true;
        static grid: { [key: string]: Node } = {};
        static collector = new Set<Node>();
        static tick = () => {
            Node.collector.clear();
        };

        readonly wide: boolean;

        constructor(public x: number, public y: number, public readonly data: string) {
            this.wide = Node.WIDE && (this.data === 'O' || this.data === '#');
            this.move();
        }

        detach() {
            delete Node.grid[pointKey(this)];
            if (this.wide) {
                delete Node.grid[pointKey({x: this.x + 1, y: this.y})];
            }
        }

        move(direction = ZeroPoint) {
            this.x += direction.x;
            this.y += direction.y;

            Node.grid[pointKey(this)] = this;
            if (this.wide) {
                Node.grid[pointKey({x: this.x + 1, y: this.y})] = this;
            }
        }

        canMove(direction: Point): boolean {
            if (this.data === '#') {
                return false;
            }

            if (Node.collector.has(this)) {
                return true;
            }

            Node.collector.add(this);

            const point = pointAdd(this, direction);

            if (!this.wide) {
                return Node.grid[pointKey(point)]?.canMove(direction) !== false;
            }

            const next = [
                Node.grid[pointKey(point)],
                Node.grid[pointKey(pointAdd(point, thePoint(1)))]
            ];

            return next.every(node => {
                return node === this || node?.canMove(direction) !== false
            });
        }
    }

    function parse(input: string, wide = true) {
        const [map, commands] = input.trim().split('\n\n');
        let robot: Node | undefined;
        let rows = 0;
        let cols = 0;

        Node.WIDE = wide;
        Node.grid = {};

        toGrid(map, (from, x, y) => {
            rows = Math.max(y, rows);
            cols = Math.max(x, cols);

            if (from === '.') {
                return;
            }

            const node = new Node(x * (wide ? 2 : 1), y, from);
            if (node.data === '@') {
                robot = node;
            }
        });

        if (!robot) {
            throw new Error('did not find robot');
        }

        const steps = commands.replace(/\n/g, '').split('');
        const compass: { [key: string]: Point } = {
            '^': COMPASS.N,
            'v': COMPASS.S,
            '<': COMPASS.W,
            '>': COMPASS.E,
        };

        return {
            tick () {
                while (steps.length) {
                    const command = steps.shift()!;
                    const direction = compass[command];

                    Node.tick();
                    if (robot!.canMove(direction)) {
                        Node.collector.forEach(node => node.detach());
                        Node.collector.forEach(node => {
                            node.move(direction);
                        });
                    }
                }
            },
            gps () {
                return sumOf(
                    Array.from(new Set(Object.values(Node.grid)), node => {
                        return node.data === 'O' ? node.x + 100 * node.y : 0
                    }),
                )
            }
        }
    }

    it('example.1a', () => {
        const p = parse(EXAMPLE_A, false);
        p.tick();

        expect(p.gps()).toBe(2028);
    });
    it('example.1b', () => {
        const p = parse(EXAMPLE, false);
        p.tick();

        expect(p.gps()).toBe(10092);
    });
    it('question.1', () => {
        const p = parse(readInputFrom(2024, 15), false);
        p.tick();

        expect(p.gps()).toBe(1456590);
    });
    it('example.2', () => {
        const p = parse(EXAMPLE, true);
        p.tick();

        expect(p.gps()).toBe(9021);
    });
    it('question.2', () => {
        const p = parse(readInputFrom(2024, 15), true);
        p.tick();

        expect(p.gps()).toBe(1489116);
    });
})