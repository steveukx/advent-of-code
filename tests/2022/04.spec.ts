import { readInputFrom, toStringArray } from '../__fixtures__';

describe('04', function () {
    const example = `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`;

    function isFullyOverlapping(line: string) {
        const [minA, maxA, minB, maxB] = Array.from(line.match(/\d+/g) || []).map(parseFloat);

        if (minA === minB || maxA === maxB) {
            return true;
        }

        return (minA < minB) ? maxA >= maxB : maxB >= maxA;
    }

    function isPartialOverlapping(line: string) {
        const [minA, maxA, minB, maxB] = Array.from(line.match(/\d+/g) || []).map(parseFloat);

        if (maxA < minB) {
            return false;
        }
        if (maxB < minA) {
            return false;
        }
        if (minA > maxB) {
            return false;
        }
        if (minB > maxA) {
            return false;
        }

        return true;
    }

    it('ex1', () => {
        console.log(toStringArray(example).filter(isFullyOverlapping));
    });

    it('q1', () => {
        console.log(
            toStringArray(readInputFrom(2022, 4, 'input')).filter(isFullyOverlapping).length
        );
    });

    it('ex2', () => {
        console.log(toStringArray(example).filter(isPartialOverlapping));
    });

    it('q2', () => {
        console.log(
            toStringArray(readInputFrom(2022, 4, 'input')).filter(isPartialOverlapping).length
        );
    });
});