import { EventEmitter } from 'events';
import { readInputFrom, toStringArray } from '../__fixtures__';

describe('09', function () {

    class Rope {
        public readonly head = new Segment();
        public readonly tail: Segment;

        public readonly segments: Segment[] = [];

        constructor(length = 0) {

            for (let parent = this.head, i = length; i >= 0; i--) {
                this.segments.unshift(
                    parent = new Segment(parent)
                );
            }

            this.tail = this.segments[0];
        }
    }

    class Segment extends EventEmitter {
        protected x = 0;
        protected y = 0;
        public touched = new Set<string>();

        constructor(protected lead?: Segment) {
            super();

            lead?.on('move', () => { this.creep() });
            this.moved();
        }

        protected creep () {
            if (!this.lead) return;

            const gX = this.lead.x - this.x;
            const gY = this.lead.y - this.y;

            if (!gY) {
                if (Math.abs(gX) > 1) {
                    this.x += gX > 0 ? 1 : -1;
                    this.moved();
                }
            } else if (!gX) {
                if (Math.abs(gY) > 1) {
                    this.y += gY > 0 ? 1 : -1;
                    this.moved();
                }
            } else if (Math.abs(gX * gY) > 1) {
                this.x += (gX > 0) ? 1 : -1;
                this.y += (gY > 0) ? 1 : -1;
                this.moved();
            }
        }

        public move(dX: number, dY: number) {
            const mX = dX ? (dX > 0 ? 1 : -1) : 0
            const mY = dY ? (dY > 0 ? 1 : -1) : 0;

            if (mX || mY) {
                this.x += mX;
                this.y += mY;

                this.moved();
            }

            if (Math.abs(dX + dY) > 1) {
                this.move(
                    dX ? (dX > 0 ? dX - 1 : dX + 1) : 0,
                    dY ? (dY > 0 ? dY - 1 : dY + 1) : 0,
                );
            }
        }

        protected moved () {
            this.touched.add(`${this.x}:${this.y}`);
            this.emit('move');
        }
    }

    function parse(input: string, rope = new Rope()) {
        const visited = rope.tail.touched;

        toStringArray(input).forEach(line => {
            const [direction, distance] = line.split(' ');

            switch (direction) {
                case 'R':
                    return rope.head.move(parseInt(distance, 10), 0);
                case 'L':
                    return rope.head.move(0 - parseInt(distance, 10), 0);
                case 'U':
                    return rope.head.move(0, parseInt(distance, 10));
                case 'D':
                    return rope.head.move(0, 0 - parseInt(distance, 10));
                default:
                    throw new Error('Unknown direction');
            }
        });

        return {
            visited,
        }
    }

    it('ex0', () => {
        const x = parse(`
            R 4
            U 4
            L 3
            D 1
            R 4
            D 1
            L 5
            R 2
        `);

        expect(x.visited.size).toBe(13);
    });

    it('q1', () => {
        const x = parse(readInputFrom(2022, 8, 'input'));

        expect(x.visited.size).toBe(5710);
    });

    it('q2', () => {
        const x = parse(readInputFrom(2022, 8, 'input'), new Rope(8));

        expect(x.visited.size).toBe(2259);
    });

});