import { readInputFrom, toLines } from '../__fixtures__';
import { sumBy } from 'lodash';

describe('07', () => {
    const EXAMPLE = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
    `;

    function simpleResult(current: number, next: number) {
        return [current + next, current * next];
    }

    function explodeResult(current: number, next: number) {
        return [current + next, current * next, parseInt(`${current}${next}`, 10)];
    }

    function validateEquation(result: number, equation: number[], resultBuilder = simpleResult) {
        const numbers = [...equation];
        let calculations = numbers.splice(0, 1);

        while (numbers.length) {
            const number = numbers.shift()!;
            calculations = calculations.flatMap(current => {
                return resultBuilder(current, number).filter(value => value <= result);
            });
        }

        return calculations.includes(result);
    }

    function parse(input: string, resultBuilder = simpleResult) {
        return sumBy(toLines(input), line => {
            const equation = line.split(/\D+/).map(Number);
            const result = equation.shift()!

            return validateEquation(result, equation, resultBuilder) && result || 0;
        });
    }

    it('example.1', () => {
        expect(parse(EXAMPLE)).toBe(3749);
    });

    it('question.1', () => {
        expect(parse(readInputFrom(2024, 7))).toBe(2299996598890);
    });

    it('example.2', () => {
        expect(parse(EXAMPLE, explodeResult)).toBe(11387);
    });

    it('question.2', () => {
        expect(parse(readInputFrom(2024, 7), explodeResult)).toBe(362646859298554);
    });
});