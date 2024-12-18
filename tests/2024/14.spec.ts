import { Point, productOf, readInputFrom, toLines } from '../__fixtures__';

describe('14', () => {
    const W = 101;
    const H = 103
    const EXAMPLE = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

    type Guard = { location: Point; velocity: Point };

    function parse(input: string) {
        return toLines(input).map(parseLine);
    }

    function parseLine(input: string): Guard {
        const numbers = input.split(/[^0-9-]+/).slice(1).map(Number);
        return {
            location: {x: numbers[0], y: numbers[1]},
            velocity: {x: numbers[2], y: numbers[3]},
        };
    }

    function print(guards: Guard[], w: number, h: number) {
        const grid = Array(w * h).fill(' ');
        for (const guard of guards) {
            const offset = guard.location.x + (guard.location.y * w);
            grid[offset] = 'X';
        }

        const out: string[] = [];
        for (let y = 0; y < h; y++) {
            out.push(
                grid.splice(0, w).join('')
            );
        }

        return `\n\n${out.join('\n')}\n\n`;
    }

    function safety(guards: Guard[], w: number, h: number, seconds = 1) {
        const wMid = Math.floor(w / 2);
        const hMid = Math.floor(h / 2);

        const quads = [0, 0, 0, 0];

        return {
            get safety() {
                return productOf(quads)
            },
            guards: guards.map(guard => {
                const x1 = guard.location.x + (guard.velocity.x * seconds);
                const y1 = guard.location.y + (guard.velocity.y * seconds);

                const x2 = x1 % w;
                const y2 = y1 % h;

                const x = (x2 < 0 ? w : 0) + x2;
                const y = (y2 < 0 ? h : 0) + y2;

                if (x !== wMid && y !== hMid) {
                    quads[(x < wMid ? 0 : 1) + (y < hMid ? 0 : 2)]++;
                }

                return {
                    location: {x, y},
                    velocity: guard.velocity,
                };
            }),
        };
    }

    it('example.1', () => {
        expect(safety(parse(EXAMPLE), 11, 7, 100).safety).toBe(12);
    });

    it('question.1', () => {
        expect(safety(parse(readInputFrom(2024, 14)), W, H, 100).safety).toBe(231019008);
    });

    it('question.2', async () => {
        let time = 0;
        let grid = parse(readInputFrom(2024, 14));

        while (++time < 100000) {
            const printed = print(
                grid = safety(grid, W, H, 1).guards,
                W,
                H,
            );

            if (printed.includes('XXXXXXXXXXXXXXX')) {
                console.log(printed);
                break;
            }
        }

        expect(time).toBe(8280);
    });
})