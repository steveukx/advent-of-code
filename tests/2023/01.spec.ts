import { readInputFrom } from '../__fixtures__';

describe('01', function () {
    const INPUT = readInputFrom(2023, 1, 'input');

    function parse (input: string, parser = parseLineA) {
        return input.split('\n').reduce((count, line) => {
            if (!line) return count;

            return count + parser(line);
        }, 0);
    }
    function parseLineA (line: string) {
        const one = line.match(/^\D*(\d)/);
        const two = line.match(/(\d)\D*$/);
        if (!one || !two) {
            throw new Error(`Malformatted line: ${line}`);
        }
        return Number(`${one[1]}${two[1]}`);
    }

    function parseLineB(line: string) {
        const nums = new Map('one|two|three|four|five|six|seven|eight|nine'.split('|').map((key, index) => [key, index + 1]));
        const value = (input: string) => nums.has(input) ? nums.get(input) : parseInt(input, 10);
        const match = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
        const left = line.match(match)!;
        for (let i = line.length - 1; i >= 0; i--) {
            const right = line.substring(i).match(match);
            if (right) {
                return Number(`${value(left[1])}${value(right[1])}`)
            }
        }

        throw new Error(`Badly formatted line: ${line}`);
    }

    it('q1', () => {
        expect(parse(INPUT)).toBe(54331);
    });

    it('ex2', () => {
        expect(parseLineB('threetwo1drtzsixtwofourppvg')).toBe(34);
    });

    it('q2', () => {
        console.log(parse(INPUT, parseLineB));
    });
});