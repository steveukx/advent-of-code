import { readInputFrom, sumOf, toLines } from '../__fixtures__';

describe('04', function () {
    const INPUT = readInputFrom(2023, 4, 'input');
    const EXAMPLE = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

    function parse(input: string, parser = parseLineA) {
        return sumOf(
            toLines(input).map((line) => {
                if (!line) return 0;

                return parser(line).score;
            })
        );
    }

    function parseLineA(line: string) {
        const p = line.split(/([:|])/);

        const card = Number(p[0].replace(/\D/g, ''));
        const winning = new Set(p[2].split(' ').filter(Boolean));
        const played = new Set(p[4].split(' ').filter(Boolean));

        const matched = intersection(winning, played);

        return {
            card,
            matched,
            winning,
            played,
            score: matched.size && Math.pow(2, matched.size - 1),
        }
    }

    function parseB(input: string) {
        const cards: Map<number, ReturnType<typeof parseLineA>> = new Map(
            toLines(input).map(line => {
                const parsed = parseLineA(line);
                return [
                    parsed.card,
                    parsed,
                ];
            })
        );
        const pile: number[] = [];

        const process = (card: number) => {
            pile.push(card);
            const {matched} = cards.get(card)!;
            for (let i = 1; i <= matched.size; i++) {
                process(card + i);
            }
        }
        for (const card of cards.keys()) process(card);

        return pile.length;
    }

    function intersection<T>(haystack: Set<T>, needle: Set<T>): Set<T> {
        if (needle.size > haystack.size) return intersection(needle, haystack);

        const result = new Set<T>();
        for (const item of needle) {
            if (haystack.has(item)) {
                result.add(item);
            }
        }
        return result;
    }

    it('ex1', () => {
      expect(parse(EXAMPLE)).toBe(13);
    })

    it('ex2', () => {
      expect(parseB(EXAMPLE)).toBe(30);
    })


    it('q1', () => {
        console.log(parse(INPUT));
    });

    it('q2', () => {
        console.log(parseB(INPUT));
    });
});