import { pointAdd, pointKey, prependItem, readInputFrom, thePoint, toLines } from '../__fixtures__';

describe('18', () => {
    const EXAMPLE = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

    class Node {

        private _corruptsAt = Number.POSITIVE_INFINITY;
        private _neighbours: Node[] | undefined;

        constructor(public readonly x: number, public readonly y: number, private readonly grid: Map<string, Node>) {
        }

        get neighbours() {
            if (!this._neighbours) {
                this._neighbours = [
                    this.grid.get(pointKey(pointAdd(this, thePoint(0, 1)))),
                    this.grid.get(pointKey(pointAdd(this, thePoint(0, -1)))),
                    this.grid.get(pointKey(pointAdd(this, thePoint(1, 0)))),
                    this.grid.get(pointKey(pointAdd(this, thePoint(-1, 0)))),
                ].filter(Boolean) as Node[];
            }

            return this._neighbours;
        }

        corruptAt(when: number) {
            this._corruptsAt = when;
            return this;
        }

        isCorrupted(at: number) {
            return at >= this._corruptsAt;
        }

    }

    class Tail {
        constructor(public readonly head: Node, public readonly path: Set<Node>) {
        }

        get size() {
            return this.path.size - 1;
        }

        advance(onto: Node) {
            return new Tail(onto, new Set([...this.path, onto]));
        }
    }

    function parse(input: string, maxX: number, maxY: number) {
        let bytes: Node[] = [];
        const grid = new Map<string, Node>();
        for (let y = 0; y < maxY; y++) {
            for (let x = 0; x < maxX; x++) {
                const node = new Node(x, y, grid);
                grid.set(pointKey(node), node);
            }
        }
        toLines(input).forEach((line, index) => {
            const [x, y] = line.split(',').map(Number);
            bytes.push(
                (grid.get(pointKey({x, y})))!.corruptAt(index + 1)
            );
        });

        function pathAt(at: number) {
            const start = grid.get(pointKey(thePoint(0, 0)));
            const finish = grid.get(pointKey(thePoint(maxX - 1, maxY - 1)));

            if (!start || !finish) {
                throw new Error(`Cannot find path edges`);
            }

            let winner: Tail | undefined;
            const lowestAt = new Map<string, Tail>();
            const queue: Tail[] = [new Tail(start, new Set([start]))];

            while (queue.length) {
                const tail = queue.shift()!;

                if (winner && tail.size >= winner.size) {
                    continue;
                }

                if (tail.head === finish) {
                    winner = (!winner || winner.size > tail.size) ? tail : winner;
                    continue;
                }

                tail.head.neighbours.forEach(node => {
                    if (node.isCorrupted(at) || tail.path.has(node)) {
                        return;
                    }

                    const nodeKey = pointKey(node);
                    const next = tail.advance(node);

                    if (lowestAt.has(nodeKey) && lowestAt.get(nodeKey)!.size <= next.size) {
                        return;
                    }

                    lowestAt.set(nodeKey, prependItem(queue, tail.advance(node)));
                });
            }

            return winner;
        }

        return {
            grid,
            bytes,
            maxX,
            maxY,
            pathAt(at: number) {
                const winner = pathAt(at);

                if (!winner) {
                    throw new Error('No winner found');
                }

                return winner;
            },
            blockedAt(min = 0) {
                let max = bytes.length - 1;
                let tail: Tail | undefined;

                while (max !== min) {
                    if (max === min + 1) {
                        return {
                            tail,
                            byte: bytes[max],
                            index: max,
                        };
                    }

                    const test = min + Math.floor((max - min) / 2);
                    const hasPathAt = pathAt(test + 1);
                    if (hasPathAt) {
                        min = test;
                        tail = hasPathAt;
                    } else {
                        max = test;
                    }
                }

                throw new Error(`Did not find a suitable byte`);
            }
        };
    }

    function draw(grid: Map<string, Node>, maxX: number, maxY: number, at: number, tail?: Tail, kill?: Node) {
        const out: string[] = [];
        for (let y = 0; y < maxY; y++) {
            let row = '';
            for (let x = 0; x < maxX; x++) {
                const node = grid.get(pointKey(thePoint(x, y)))!;
                const c = node.isCorrupted(at);
                const p = tail?.path.has(node);

                if ((c && p) || node === kill) row += ('X');
                else if (c) row += ('#');
                else if (p) row += ('O');
                else row += ('.');
            }
            out.push(row);
        }

        console.log(`\n\n${out.join('\n')}\n\n`);
    }

    it('example.1', () => {
        const p = parse(EXAMPLE, 7, 7);
        expect(p.pathAt(12).size).toBe(22);
    });

    it('question.1', () => {
        const p = parse(readInputFrom(2024, 18), 71, 71);
        expect(p.pathAt(1024).size).toBe(252);
    });

    it('example.2', () => {
        const p = parse(EXAMPLE, 7, 7);
        const block = p.blockedAt();

        draw(p.grid, p.maxX, p.maxY, block.index, block.tail, block.byte);

        expect(pointAdd(block.byte)).toEqual(thePoint(6, 1));
    });

    it('question.2', () => {
        const p = parse(readInputFrom(2024, 18), 71, 71);
        const block = p.blockedAt(1024);

        draw(p.grid, p.maxX, p.maxY, block.index, block.tail, block.byte);

        expect(pointAdd(block.byte)).toEqual(thePoint(5, 60));
    });
})