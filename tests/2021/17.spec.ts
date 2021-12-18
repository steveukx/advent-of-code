import { factorial, Range, withinRange } from '../__fixtures__';

describe('Year 2021: Day 17', () => {
    const sampleData = `target area: x=20..30, y=-10..-5`;
    const inputData = `target area: x=94..151, y=-156..-103`;

    type TRange = { y1: number; x1: number; y2: number; x2: number };

    function range(input: string): TRange {
        const [, x, y] = /x=([\d.-]+), y=([\d.-]+)$/.exec(input) || [];
        return {
            x1: Number(x.replace(/\..+$/, '')),
            x2: Number(x.replace(/^.*\.\./, '')),
            y1: Number(y.replace(/\..+$/, '')),
            y2: Number(y.replace(/^.*\.\./, '')),
        };
    }

    function velocityRangeX(range: TRange) {
        let i = 0;
        let sum = 0;
        while ((sum + i) < range.x1) {
            sum += i++;
        }

        return [i, range.x2];
    }

    function velocityRangeY(range: TRange) {
        return [Math.abs(range.y1) - 1, range.y1];
    }

    function velocities(range: TRange) {
        const result = new Set<string>();
        for (let [x, maxX] = velocityRangeX(range); x <= maxX; x++) {
            for (let [maxY, y] = velocityRangeY(range); y <= maxY; y++) {
                if (validateVelocity(range, x, y)) {
                    result.add(`${x},${y}`);
                }
            }
        }
        return result;
    }

    function validateVelocity(range: TRange, x: number, y: number, offsetX = 0, offsetY = 0): boolean {
        const testX = withinRange(range.x1, range.x2, offsetX);
        const testY = withinRange(range.y1, range.y2, offsetY);

        if (testX === Range.WITHIN && testY === Range.WITHIN) {
            return true;
        }

        if (testX === Range.ABOVE || testY === Range.BELOW) {
            return false;
        }

        return validateVelocity(range, nextX(x), y - 1, offsetX + x, offsetY + y);
    }

    function nextX(x: number) {
        return x ? (x > 0 ? x - 1 : x + 1) : x;
    }

    it.each([
        [10, 9],
        [1, 0],
        [0, 0],
        [-1, 0],
        [-5, -4],
    ])('gets next x velocity from %s', (from, expected) => {
        expect(nextX(from)).toBe(expected);
    });

    it('validates velocity', () => {
        const r = range(sampleData);
        expect(validateVelocity(r, 7, 2)).toBe(true);
        expect(validateVelocity(r, 9, 0)).toBe(true);
        expect(validateVelocity(r, 17, -4)).toBe(false);
        expect(validateVelocity(r, 6, 9)).toBe(true);

        expect(velocities(r).size).toBe(112);
    });

    it('gets velocityX range', () => {
        expect(velocityRangeX(range(sampleData))).toEqual([6, 30]);
    });

    it('gets the velocityY range', () => {
        expect(velocityRangeY(range(sampleData))).toEqual([9, -10]);
    })

    it('converts to a range', () => {
        expect(range(sampleData)).toEqual({x1: 20, x2: 30, y1: -10, y2: -5});
    });

    it('prepares for question one', () => {
        expect(factorial(Math.abs(range(sampleData).y1) - 1)).toBe(45);
    })

    it('tries question one', () => {
        expect(factorial(Math.abs(range(inputData).y1) - 1)).toBe(12090);
    });

    it('tries question two', () => {
        expect(velocities(range(inputData)).size).toBe(5059);
    });
});