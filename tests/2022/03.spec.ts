import { readInputFrom } from '../__fixtures__';
import { toStringArray } from '../__fixtures__/parse';

describe('03', function () {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const ALPHA = alpha.toUpperCase();

    const scores = new Map([
        ...Array.from<string, [string, number]>(alpha, (letter, index) => {
            return [letter, index + 1];
        }),
        ...Array.from<string, [string, number]>(ALPHA, (letter, index) => {
            return [letter, index + 27];
        }),
    ]);

    function rucksack(spec: string, _overlap = intersection, _score = score) {
        const mid = spec.length / 2;
        const left = spec.substring(0, mid);
        const right = spec.substring(mid);

        return _score(
            _overlap(left, right)
        );
    }

    function score(letter: string) {
        return scores.get(letter) || 0;
    }

    function intersection(a: string, b: string, ...rest: string[]): string {
        const left = new Set(a);
        const right = new Set(b);
        const matches = new Set();
        right.forEach(char => left.has(char) && matches.add(char));

        const result = Array.from(matches).join('');

        return rest.length ? intersection(result, ...rest as [string]) : result;
    }

    function fromInput(input: string) {
        return input.trim().split('\n').reduce(
            (sum, line) => sum + rucksack(line.trim()),
            0
        );
    }

    function fromBatch(input: string) {
        let result = 0;
        const data = toStringArray(input);

        for (let i = 0, max = data.length; i < max;) {
            const a = data[i++] || '';
            const b = data[i++] || '';
            const c = data[i++] || '';

            result += score(intersection(a, b, c));
        }

        return result;
    }

    it('eg1', () => {
        const actual = fromInput(`
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
        `);

        expect(actual).toEqual(157)
    });

    it('q1', () => {
        const actual = fromInput(readInputFrom(2022, 3, 'sample'));

        expect(actual).toEqual(7967);
    });

    it('eg2', () => {
        const actual = fromBatch(`
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
        `);

        expect(actual).toEqual(70)
    });


    it('q2', () => {
        const actual = fromBatch(readInputFrom(2022, 3, 'sample'));

        expect(actual).toEqual(2716);
    });
});