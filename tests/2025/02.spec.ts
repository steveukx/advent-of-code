import { sum } from 'lodash';
import { readInputFrom } from '../__fixtures__';

describe('02', () => {

    function palendromic(input: string) {
        const halfway = input.length / 2;
        if (Math.floor(halfway) !== halfway) {
            return false;
        }

        return input.slice(0, halfway) === input.slice(halfway);
    }

    function findInvalidInRange(lower: number, upper: number, ...detectors: Array<(input: string) => boolean>) {
        const count: number[] = [];
        for (let i = lower; i <= upper; i++) {
            if (detectors.some(detector => detector(String(i)))) {
                count.push(i);
            }
        }
        return count;
    }

    function fromTwoChars(input: string) {
        const len = input.length;
        const mid = Math.floor(len / 2);
        for (let i = 1; i <= mid; i++) {
            if (len % i) {
                continue;
            }

            const str = input.slice(0, i);
            let match = true;
            for (let jump = str.length, j = jump; j < len && match; j += jump) {
                if (input.substring(j, j + jump) !== str) {
                    match = false;
                }
            }

            if (match) {
                return true;
            }
        }

        return false;
    }

    function parse(input: string, ...detectors: Array<(input: string) => boolean>) {
        const invalid = input.split(',').flatMap(range => {
            const [lower, upper] = range.split('-');
            return findInvalidInRange(Number(lower), Number(upper), ...detectors);
        });

        return {
            invalid,
            invalidSum: sum(invalid),
        };
    }

    function parseOne(input: string) {
        return parse(input, palendromic);
    }

    function parseTwo(input: string) {
        return parse(input, palendromic, fromTwoChars);
    }

    it('detects two chars', () => {
        expect(fromTwoChars('99')).toBe(true);
        expect(fromTwoChars('111')).toBe(true);
        expect(fromTwoChars('12341234')).toBe(true);
        expect(fromTwoChars('919')).toBe(false);
        expect(fromTwoChars('1121')).toBe(false);
        expect(fromTwoChars('123451234')).toBe(false);
    })

    it('detects palendromes', () => {
        expect(palendromic('1')).toBe(false);
        expect(palendromic('11')).toBe(true);
        expect(palendromic('1188511885')).toBe(true);
        expect(palendromic('11885111885')).toBe(false);
    });

    it('detects palendromes in range', () => {
        expect(findInvalidInRange(1188511880, 1188511890, palendromic)).toEqual([1188511885]);
        expect(findInvalidInRange(10, 20, palendromic)).toEqual([11]);
        expect(findInvalidInRange(12, 20, palendromic)).toEqual([]);
    });

    it('example.1', () => {
        expect(parseOne('11-22,95-115,998-1012,1188511880-1188511890,222220-222224,' +
            '1698522-1698528,446443-446449,38593856-38593862,565653-565659,' +
            '824824821-824824827,2121212118-2121212124').invalidSum).toBe(1227775554);
    });

    it('example.2', () => {
        expect(parseTwo('11-22,95-115,998-1012,1188511880-1188511890,222220-222224,' +
            '1698522-1698528,446443-446449,38593856-38593862,565653-565659,' +
            '824824821-824824827,2121212118-2121212124').invalidSum).toBe(4174379265);
    });

    it('q1', () => {
        expect(parseOne(readInputFrom(2025, 2)).invalidSum).toBe(15873079081);
    });

    it('q2', () => {
        expect(parseTwo(readInputFrom(2025, 2)).invalidSum).toBe(22617871034);
    });


});