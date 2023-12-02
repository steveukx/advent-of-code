import { productOf, readInputFrom, sumOf, toLines } from '../__fixtures__';

describe('02', function () {
    const INPUT = readInputFrom(2023, 2, 'input');

    function parse(input: string, parser = parseLineA) {
        return sumOf(
            toLines(input).map((line) => {
                if (!line) return 0;

                return parser(line);
            })
        );
    }

    function parseLineA(line: string) {
        const max = {
            blue: 14,
            red: 12,
            green: 13,
        };
        const possiblePick = (pick: string): boolean => {
            const [left, right] = pick.split(' ');
            if (right in max) {
                return Number(left) <= max[right as keyof typeof max];
            }
            throw new Error(`Unknown pick colour: ${pick}`);
        };

        const content = line.split(':');
        const game = Number(content[0].replace(/\D/g, ''));
        for (const draw of content[1].split(';')) {
            if (!(draw.match(/(\d+) (blue|red|green)/g) || []).every(possiblePick)) {
                return 0;
            }
        }

        return game;
    }

    function parseLineB(line: string) {
        const content = line.split(':');
        const max = {
            red: 0,
            green: 0,
            blue: 0,
        };
        const consumePick = (pick: string) => {
            const [left, right] = pick.split(' ') as [string, keyof typeof max];
            max[right] = Math.max(max[right], Number(left));
        };

        for (const draw of content[1].split(';')) {
            (draw.match(/(\d+) (blue|red|green)/g) || []).forEach(consumePick);
        }

        const result = Object.values(max);
        if (result.includes(0)) {
            throw new Error('Deal with a zero');
        }

        return productOf(result);
    }

    it.each([
        ['Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green', 1],
        ['Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue', 2],
        ['Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red', 0],
        ['Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red', 0],
        ['Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green', 5],
    ])('ex1: %s', (line, expected) => {
        const actual = parseLineA(line);
        expect(actual).toBe(expected);
    })

    it.each([
        ['Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green', 48],
        ['Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue', 12],
        ['Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red', 1560],
        ['Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red', 630],
        ['Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green', 36],
    ])('ex2: %s', (line, expected) => {
        const actual = parseLineB(line);
        expect(actual).toBe(expected);
    })

    it('q1', () => {
        expect(parse(INPUT)).toBe(2439);
    });

    it('q2', () => {
        console.log(parse(INPUT, parseLineB));
    });
});