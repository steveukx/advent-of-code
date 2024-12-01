import { readInputFrom, sortAsc, toLines } from '../__fixtures__';
import { toNumber } from 'lodash';

describe('01', function () {

    const EXAMPLE = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

    function parse(input: string): [number[], number[]] {
        const left: number[] = [];
        const right: number[] = [];
        toLines(input.trim()).forEach(line => {
            const result = /(\d+)\s+(\d+)/.exec(line);
            if(result) {
                left.push(toNumber(result[1]));
                right.push(toNumber(result[2]));
            }
        });

        return [sortAsc(left), sortAsc(right)];
    }

    function distance([left, right]: [number[], number[]]) {
        return left.reduce((sum, location, index) => {
            return sum + Math.abs(location - right[index]);
        }, 0);
    }

    function similarity([left, right]: [number[], number[]]) {
        const counts = right.reduce((all, location) => {
            all.set(location, (all.get(location) ?? 0) + 1);
            return all;
        }, new Map<number, number>());

        return left.reduce((sum, location) => {
            return sum + (location * (counts.get(location) ?? 0));
        }, 0);
    }

    it('example.1', () => {
        const parsed = parse(EXAMPLE);
        const result = distance(parsed);

        expect(result).toBe(11);
    });

    it('example.2', () => {
        const parsed = parse(EXAMPLE);
        const result = similarity(parsed);

        expect(result).toBe(31);
    });

    it('question.1', () => {
        const parsed = parse(readInputFrom(2024, 1, 'input'));
        const result = distance(parsed);

        expect(result).toBe(1651298);
    });

    it('question.2', () => {
        const parsed = parse(readInputFrom(2024, 1, 'input'));
        const result = similarity(parsed);

        expect(result).toBe(21306195);
    });
})