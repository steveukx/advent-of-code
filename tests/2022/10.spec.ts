import { Range, readInputFrom, sumOf, toStringArray, withinRange } from '../__fixtures__';

describe('10', function () {

    function* strength(programme: string[], yields: (cycle: number) => boolean) {
        let cycle = 1;
        let X = 1;
        let addX: null | number = null;

        function process() {
            if (addX) {
                X += addX;
                addX = null;
                return;
            }

            const line = programme.shift()!;
            const [command, value] = line.split(' ');
            switch (command) {
                case 'noop':
                    addX = null;
                    break;

                case 'addx':
                    addX = parseInt(value, 10) || 0;
                    break;

                default:
                    throw new Error(`Unknown command: ${command}`);
            }
        }

        while (programme.length) {
            if (yields(cycle)) {
                yield {
                    cycle,
                    X,
                    strength: cycle * X,
                };
            }

            cycle += 1;
            process();
        }
    }

    function sum(input: string, indices: number[] = [20, 60, 100, 140, 180, 220]) {
        const strengths = Array.from(
            strength(toStringArray(input), (cycle: number) => {
                if (cycle === indices[0]) {
                    return Boolean(indices.shift() || 1);
                }
                return false;
            }),
            (x) => x.strength,
        );

        return sumOf(strengths);
    }

    function draw(input: string, dark = ' ', lit = '#') {
        const grid: string[] = [];
        let cycle = 0;
        for (const {X} of strength(toStringArray(input), () => true)) {
            const row = Math.floor(cycle / 40);
            const col = cycle % 40;

            if (row >= grid.length) grid.push('');

            grid[row] += (
                withinRange(X - 1, X + 1, col) === Range.WITHIN ? dark : lit
            );

            cycle++;
        }

        console.log(
            grid.join('\n')
        )
    }

    it('ex1', () => {
        const actual = sum(readInputFrom(2022, 10, 'sample'));
        expect(actual).toBe(13140);
    });

    it('q1', () => {
        const actual = sum(readInputFrom(2022, 10, 'input'));
        expect(actual).toBe(13720);
    });

    it('ex2', () => {
        draw(readInputFrom(2022, 10, 'sample'));
    });

    it('q2', () => {
        draw(readInputFrom(2022, 10, 'input'));
    });
});