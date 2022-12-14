import { readInputFrom, sumOf, toStringArray } from '../__fixtures__';

describe('13', function () {
    const sampleData = `
        [1,1,3,1,1]
        [1,1,5,1,1]
        
        [[1],[2,3,4]]
        [[1],4]
        
        [9]
        [[8,7,6]]
        
        [[4,4],4,4]
        [[4,4],4,4,4]
        
        [7,7,7,7]
        [7,7,7]
        
        []
        [3]
        
        [[[]]]
        [[]]
        
        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]
    `;
    const inputData = readInputFrom(2022, 13, 'input');

    type Side = undefined | number | Array<number | number[]>;

    function compare(left: Side, right: Side): 'equal' | 'right' | 'wrong' {
        const aLeft = Array.isArray(left);
        const aRight = Array.isArray(right);

        if (left === undefined) {
            return right === undefined ? 'equal' : 'right';
        }

        if (right === undefined) {
            return 'wrong';
        }

        if (aLeft !== aRight) {
            return compare(aLeft ? left : [left], aRight ? right : [right]);
        }

        if (aLeft && aRight) {
            // return compare(left[0], right[0]);
            for (let i = 0, max = Math.max(left.length, right.length); i < max; i++) {
                const result = compare(left[i], right[i]);
                if (result === 'equal') {
                    continue;
                }

                return result;
            }
            return 'equal';
        }

        if (left === right) {
            return 'equal';
        }

        return left <= right ? 'right' : 'wrong';
    }

    function parse(input: string) {
        const lines = toStringArray(input);
        const good: number[] = [];

        for (let i = 0, max = lines.length, couple = 1; i < max; i++, couple++) {
            const left = JSON.parse(lines[i++]);
            const right = JSON.parse(lines[i++]);
            const correct = compare(
                left, right
            );

            correct === 'right' && good.push(couple);
        }

        return {good};
    }

    function sort(input: string) {
        const one = [[2]];
        const two = [[6]];
        const lines = [
            ...toStringArray(input).filter(Boolean).map(line => JSON.parse(line)),
            one,
            two,
        ];
        lines.sort((a, b) => {
            const compared = compare(a, b);
            if (compared === 'equal') return 0;
            return compared === 'wrong' ? 1 : -1;
        });

        const key = (lines.indexOf(one) + 1) * (lines.indexOf(two) + 1);

        debugger;

        return {lines, key};
    }

    it('ex1', () => {
        expect(
            sumOf(parse(sampleData).good)
        ).toBe(13)
    });

    it('ex2', () => {
        expect(sort(sampleData).key).toBe(140);
    });

    it('q1', () => {
        expect(
            sumOf(parse(inputData).good)
        ).toBe(5905)
    });

    it('q2', () => {
        expect(sort(inputData).key).toBe(21691);
    });
});