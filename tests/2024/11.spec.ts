import { readInputFrom, sumOf } from '../__fixtures__';

describe('11', () => {

    function parse(input: string) {
        const cells = input.split(' ').map(Number);

        function blinkAll(was = cells, count = 1) {
            if (count > 1) {
                was = blinkAll(was, count - 1);
            }
            return was.flatMap(blink);
        }

        function split(stone: number) {
            const str = String(stone);
            const mid = str.length / 2;
            return [
                Number(str.substring(0, mid)),
                Number(str.substring(mid)),
            ];
        }

        function blink(stone: number) {
            switch (true) {
                case stone === 0:
                    return 1;
                case !(String(stone).length % 2):
                    return split(stone);
                default:
                    return stone * 2024;
            }
        }

        function blinkCounts(stones= cells, blinks = 1) {
            let counts = stones.reduce((all, stone) => {
                return all.set(stone, (all[stone] ?? 0) + 1);
            }, new Map<number, number>());

            function step() {
                const next = new Map<number, number>();

                function add(blinked: number, count: number) {
                    next.set(blinked, (next.get(blinked) ?? 0) + count);
                }

                for (const [stone, count] of counts.entries()) {
                    const blinked = blink(stone);
                    if (typeof blinked === 'number') {
                        add(blinked,  count);
                    }
                    else {
                        add(blinked[0], count);
                        add(blinked[1], count);
                    }
                }

                return next;
            }

            while (blinks > 0) {
                counts = step();
                blinks--
            }

            return sumOf(
                Array.from(counts.values())
            );
        }

        return {
            cells,
            blinkAll,
            blinkCounts,
        };
    }

    it('example.1', () => {
        expect(parse('125 17').blinkAll(undefined, 25)).toHaveLength(55312);
    });

    it('example.2', () => {
        expect(parse('125 17').blinkCounts(undefined, 25)).toBe(55312);
    });

    it('question.1', () => {
        expect(parse(readInputFrom(2024, 11)).blinkAll(undefined, 25)).toHaveLength(222461);
    });

    it('question.2', () => {
        expect(parse(readInputFrom(2024, 11)).blinkCounts(undefined, 75)).toBe(264350935776416);
    });
})