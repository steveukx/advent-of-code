import { Cell, neighbours, readInputFrom, sumOf, toTabular } from '../__fixtures__';

describe('10', () => {
    const EMPTY = [];
    const EXAMPLE = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`.trim();

    class Node extends Cell<number> {
        toString() {
            return this.key;
        }

        get isStart() {
            return this.data === 0;
        }

        get isFinish() {
            return this.data === 9;
        }

        validFrom(node: Node) {
            return this.data === node.data + 1;
        }
    }

    function parse(input: string) {
        const trails = new Map<Node, Node[][]>();
        const t = toTabular(input, (from, x, y) => {
            const node = new Node(x, y, Number(from));
            node.isStart && trails.set(node, []);
            return node;
        });

        const paths = Array.from(trails.keys(), node => [node]);
        do {
            const steps = paths.splice(0, paths.length);
            for (const path of steps) {
                const head = path.at(-1);
                if (head.isFinish) {
                    trails.get(path.at(0))!.push(path);
                    continue;
                }

                for (const neighbour of neighbours(head.x, head.y, t.grid, false)) {
                    if (neighbour.validFrom(head)) {
                        paths.push([...path, neighbour]);
                    }
                }
            }
        }
        while (paths.length);

        return {
            score: sumOf(
                Array.from(trails.values(), (paths) => {
                    return new Set(paths.map(path => path.at(-1))).size
                })
            ),
            rating: sumOf(
                Array.from(trails.values(), (paths) => paths.length),
            )
        }
    }

    it('example.1', () => {
        expect(parse(EXAMPLE).score).toBe(36);
    });

    it('example.2', () => {
        expect(parse(EXAMPLE).rating).toBe(81);
    });

    it('question.1', () => {
        expect(parse(readInputFrom(2024, 10)).score).toBe(782);
    });

    it('question.2', () => {
        expect(parse(readInputFrom(2024, 10)).rating).toBe(1694);
    });
})