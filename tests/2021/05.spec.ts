import { readInputFrom, toLines } from '../__fixtures__';

describe('Year 2021: Day 5', () => {

    function line(input: string) {
        const result: string[] = [];

        const [x1, y1, x2, y2] = Array.from(input.split(/\D+/), Number);
        if (x1 !== x2 && y1 !== y2) {
            return result;
        }

        for (let x = Math.min(x1, x2), maxX = Math.max(x1, x2); x <= maxX; x++) {
            for (let y = Math.min(y1, y2), maxY = Math.max(y1, y2); y <= maxY; y++) {
                result.push(`${x},${y}`);
            }
        }

        return result;
    }

    function diagonal(input: string) {
        const result: string[] = [];

        const [x1, y1, x2, y2] = Array.from(input.split(/\D+/), Number);
        if (x1 === x2 || y1 === y2) {
            return result;
        }

        if (Math.abs(x2 - x1) !== Math.abs(y2 - y1)) {
            throw new Error(`Unable to process diagonal lines not at 45°`);
        }

        const steps = Math.abs(x2 - x1);
        const xDelta = x1 > x2 ? -1 : 1;
        const yDelta = y1 > y2 ? -1 : 1;

        for (let i = 0, x = x1, y = y1; i <= steps; i++) {
            result.push(`${x},${y}`);
            x += xDelta;
            y += yDelta;
        }

        return result;
    }

    function findDuplicates(input: string[]) {
        const seen = new Set<string>();
        const duplicates = new Set<string>();

        input.forEach(item => seen.has(item) ? duplicates.add(item) : seen.add(item));

        return duplicates;
    }

    function straightLineOverlaps(input: string) {
        const data = toLines(input.trim()).flatMap(line);
        return findDuplicates(data).size;
    }

    function anyLineOverlaps(input: string) {
        const data = toLines(input.trim()).flatMap(item => {
            return [...line(item), ...diagonal(item)];
        });
        return findDuplicates(data).size;
    }

    it('creates points from input LTR', () => {
        expect(line('0,9 -> 5,9')).toEqual(['0,9', '1,9', '2,9', '3,9', '4,9', '5,9']);
    });

    it('creates points from input RTL', () => {
        expect(line('9,4 -> 3,4')).toEqual(['3,4', '4,4', '5,4', '6,4', '7,4', '8,4', '9,4']);
    });

    it('ignores diagonal points from input', () => {
        expect(line('8,0 -> 0,8')).toEqual([]);
    });

    it('ignores straight line points from input', () => {
        expect(diagonal('9,4 -> 3,4')).toEqual([]);
    });

    it('creates points from diagonal input RTL', () => {
        expect(diagonal('3,0 -> 0,3')).toEqual(['3,0', '2,1', '1,2', '0,3']);
    });

    it('creates points from diagonal input RTL', () => {
        expect(diagonal('1,3 -> 3,1')).toEqual(['1,3', '2,2', '3,1']);
    });

    describe('questions', () => {
        const sample = readInputFrom(2021, 5, 'sample');
        const input = readInputFrom(2021, 5, 'input');

        it('prepares for question one', () => {
            expect(straightLineOverlaps(sample)).toBe(5);
        })

        it('gets one gold star', () => {
            expect(straightLineOverlaps(input)).toBe(4873);
        });

        it('prepares for question two', () => {
            expect(anyLineOverlaps(sample)).toBe(12);
        })

        it('gets one gold star', () => {
            expect(anyLineOverlaps(input)).toBe(19472);
        });


    });

})