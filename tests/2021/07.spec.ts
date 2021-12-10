import { factorial as getFactorial, readInputFrom, sumOf } from '../__fixtures__';

describe('year 2021: Day 7', () => {

    function ordered(input: string) {
        return input.trim().split(',').map(Number).sort((a, b) => a - b);
    }

    function median(input: number[]) {
        return input[Math.ceil(input.length / 2) - 1];
    }

    function mean(input: number[]) {
        return Math.ceil(sumOf(input) / input.length);
    }

    function moves(input: number[], from: number, consumption = linear) {
        return input.reduce((count, current) => count + consumption(current, from), 0);
    }

    function linear(current: number, from: number) {
        return Math.abs(current - from);
    }

    function factorial(current: number, from: number) {
        return getFactorial(linear(current, from));
    }

    function fuel(input: string, midPoint = median, consumption: (current: number, from: number) => number = linear) {
        const numbers = ordered(input);
        const mid = midPoint(numbers);
        let results = [
            moves(numbers, mid - 1, consumption),
            moves(numbers, mid, consumption),
            moves(numbers, mid + 1, consumption),
        ];

        for (let i = 1; i < 50; i++) {
            if (results[1] < results[0] && results[1] < results[2]) {
                break;
            }

            if (results[1] > results[0]) {
                results = [
                    moves(numbers, mid - i - 1, consumption),
                    moves(numbers, mid - i, consumption),
                    moves(numbers, mid - i + 1, consumption),
                ];
            } else if (results[1] < results[0]) {
                results = [
                    moves(numbers, mid + i - 1, consumption),
                    moves(numbers, mid + i, consumption),
                    moves(numbers, mid + i + 1, consumption),
                ];
            }
        }

        debugger;
        return results[1];
    }

    it('generates factorial', () => {
        expect(factorial(0, 1)).toBe(1);
        expect(factorial(4, 1)).toBe(6);
        expect(factorial(2, 5)).toBe(6);
    })

    it('orders the input', () => {
        expect(ordered('14,16,2,5')).toEqual([2, 5, 14, 16]);
    });

    it('determines the median', () => {
        expect(median([1, 1, 2, 3, 3])).toBe(2);
        expect(median([1, 3, 4, 4])).toBe(3);
    });

    it('counts moves', () => {
        expect(moves([1, 1, 2, 3, 3], 2)).toBe(4);
        expect(moves([1, 1, 2, 3, 3], 1)).toBe(5);
        expect(moves([1, 4, 4, 4, 4], 4)).toBe(3);
        expect(moves([1, 4, 4, 4, 4], 3)).toBe(6);
    });

    describe('questions', () => {
        const sample = '16,1,2,0,4,2,7,1,2,14';
        const input = readInputFrom(2021, 7, 'input');

        it('prepares for question one', () => {
            expect(fuel(sample, median, linear)).toBe(37);
        });

        it('gets one gold star', () => {
            expect(fuel(input, median, linear)).toBe(352707);
        });

        it('prepares for question two', () => {
            expect(fuel(sample, mean, factorial)).toBe(168);
        });

        it('gets second gold star', () => {
            expect(fuel(input, mean, factorial)).toBe(95519693);
        });
    });
})