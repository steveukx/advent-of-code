import { sum } from 'lodash';
import { readInputFrom } from '../__fixtures__';

describe('03', () => {
    function findMax(numbers: number[]) {
        for (let i = 9; i >= 0; i--) {
            const index = numbers.indexOf(i);
            if (index > -1) {
                return {
                    index,
                    value: numbers[index],
                };
            }
        }

        throw new Error('No numbers found - empty array?');
    }

    function joltage(input: string, remaining = 2) {
        const numbers = input.split('').map(Number);
        const matches: number[] = [];

        while (remaining) {
            remaining -= 1;

            const result = findMax(numbers.slice(0, numbers.length - remaining));
            matches.push(result.value);
            numbers.splice(0, result.index + 1);
        }

        return Number(matches.join(''));
    }

    function parse(input: string, size = 2) {
        return sum(
            input.trim().split('\n').map(line => joltage(line, size)),
        );
    }

    it.each<[string, number]>([
        ['987654321111111', 98],
        ['811111111111119', 89],
        ['234234234234278', 78],
    ])('calculates joltage %s=%s', (input, expected) => {
        expect(joltage(input)).toBe(expected);
    });

    it('one', () => {
        expect(parse(readInputFrom(2025, 3), 2)).toBe(17087);
    });

    it('two', () => {
        expect(parse(readInputFrom(2025, 3), 12)).toBe(169019504359949);
    });

})