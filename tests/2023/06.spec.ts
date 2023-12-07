import { productOf, readInputFrom, toLines } from '../__fixtures__';

describe('06', function () {
    const INPUT = readInputFrom(2023, 6, 'input');
    const EXAMPLE = `Time:      7  15   30
Distance:  9  40  200
`;

    const distancesForDuration = function (duration: number) {
        let numbers = Array.from({length: duration}, (_, wait) => {
            return (duration - wait) * wait;
        });
        return numbers;
    }

    function parse(input: string, parseLine = parserA) {
        const lines = toLines(input);
        const a = parseLine(lines.shift()!);
        const b = parseLine(lines.shift()!);

        return productOf(
            a.map((duration, index) => {
                const required = b[index];
                return distancesForDuration(duration).filter(item => item > required).length
            })
        );
    }

    function parserA(line: string) {
        return line.split(/\s+/).slice(1).map(Number);
    }

    function parserB(line: string) {
        return [parseInt(line.replace(/\D/g, ''), 10)];
    }

    it('ex1', () => {
        expect(parse(EXAMPLE)).toBe(288);
    })

    it('ex2', () => {
        expect(parse(EXAMPLE, parserB)).toBe(71503);
    })

    it('q1', () => {
        console.log(parse(INPUT));
    });

    it('q2', () => {
        console.log(parse(INPUT, parserB));
    });
});