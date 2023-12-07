import { readInputFrom, sumOf, toLines } from '../__fixtures__';

describe('07', function () {
    const INPUT = readInputFrom(2023, 7, 'input');
    const EXAMPLE = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

    type Hand = { cards: string; rank: number; bid: number };

    const CARDS = Object.fromEntries('23456789TJQKA'.split('').map((key, value) => {
        return [key, value]
    }));
    const CARDS_WITH_JOKERS = Object.fromEntries('J23456789TQKA'.split('').map((key, value) => {
        return [key, value]
    }));

    function parse(input: string, parseLine = parseHandA, scores = CARDS) {
        const game = toLines(input).map(parseLine);
        const sorted = [...game].sort(sortBy(scores));
        const winnings = sumOf(
            sorted.map((hand, index) => hand.bid * (index + 1))
        );

        return {game, sorted, winnings};
    }

    /**
     * Lower is better
     */
    function rankHand(counts: number[]) {
        if (counts.includes(5)) {
            return 0;
        }
        if (counts.includes(4)) {
            return 1;
        }
        if (counts.includes(3)) {
            return counts.includes(2) ? 2 : 3;
        }
        if (counts.includes(2)) {
            return counts.length === 3 ? 4 : 5;
        }
        return 6;
    }

    function sortBy(cards: { [key: string]: number }) {
        return (a: Hand, b: Hand) => {
            if (a.rank != b.rank) {
                return a.rank < b.rank ? 1 : -1;
            }

            for (let i = 0; i < 5; i++) {
                const left = cards[a.cards[i]];
                const right = cards[b.cards[i]];

                if (left !== right) {
                    return left < right ? -1 : 1;
                }
            }

            return 0;
        }
    }

    function parseHandA(line: string): Hand {
        const [cards, bid] = line.split(' ');

        const counts = Array.from(
            cards.split('').reduce((all, card) => {
                all.set(card, (all.get(card) || 0) + 1);
                return all;
            }, new Map<string, number>()).values()
        );

        const rank = rankHand(counts);

        return {
            bid: Number(bid),
            cards,
            rank,
        };
    }

    function parseHandB(line: string): Hand {
        const [cards, bid] = line.split(' ');
        let jokers = 0;
        const hand = cards.split('').reduce((all, card) => {
            if (card === 'J') {
                jokers++;
            } else {
                all.set(card, (all.get(card) || 0) + 1);
            }
            return all;
        }, new Map<string, number>());

        const counts = Array.from(hand.values()).sort((a, b) => a < b ? 1 : -1);
        if (!counts.length) {
            counts.push(0);
        }
        counts[0] += jokers;

        const rank = rankHand(counts);

        return {
            bid: Number(bid),
            cards,
            rank,
        };
    }

    it('ex1', () => {
        expect(parse(EXAMPLE).winnings).toBe(6440);
    })

    it('ex2', () => {
        expect(parse(EXAMPLE, parseHandB, CARDS_WITH_JOKERS).winnings).toBe(5905);
    })

    it('q1', () => {
        console.log(parse(INPUT).winnings);
    });

    it('q2', () => {
        console.log(parse(INPUT, parseHandB, CARDS_WITH_JOKERS).winnings);
    });
});