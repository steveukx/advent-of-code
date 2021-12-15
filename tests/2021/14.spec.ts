import { readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 14', () => {

    const inputData = readInputFrom(2021, 14, 'input');
    const sampleData = readInputFrom(2021, 14, 'sample');

    function parseInput(input: string) {
        const lines = input.split('\n');
        const polymer = lines.shift()!.split('');
        const tail = polymer[polymer.length - 1]!;
        const couplets = new Map<string, number>();
        for (let i = 0; i < polymer.length - 1; i++) {
            addCouplet(polymer[i] + polymer[i + 1]);
        }

        const rules = lines.reduce((all, rule) => {
            const [, pair, insert] = /^([A-Z]{2}).*([A-Z])$/.exec(rule) || [];
            return (pair && insert) ? all.set(pair, insert) : all;
        }, new Map<string, string>());

        function addCouplet(couplet: string, increment = 1) {
            couplets.set(couplet, (couplets.get(couplet) || 0) + increment);
        }

        function delCouplet(couplet: string, decrement = 1) {
            const count = couplets.get(couplet);
            if (count) {
                couplets.set(couplet, count - decrement);
            }
        }

        const output: { rating(): number; run(times?: number): typeof output } = {
            rating() {
                const counts: Record<string, number> = {[tail]: 1};

                for (const [couple, count] of couplets) {
                    if (count) {
                        const char = couple.charAt(0);
                        counts[char] = (counts[char] || 0) + count;
                    }
                }

                const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
                const min = sorted.shift()![1];
                const max = sorted.pop()![1];

                return max - min;
            },
            run(times = 1): typeof output {
                for (const [couplet, count] of Array.from(couplets)) {
                    const insert = rules.get(couplet);
                    if (!insert || !count) continue;

                    delCouplet(couplet, count);
                    addCouplet(`${couplet.charAt(0)}${insert}`, count);
                    addCouplet(`${insert}${couplet.charAt(1)}`, count);
                }

                if (times > 1) {
                    return output.run(times - 1);
                }

                return output;
            },
        }

        return output;
    }

    it('prepares for question one', () => {
        expect(parseInput(sampleData).run(10).rating()).toBe(1588);
    })

    it('attempts question one', () => {
        expect(parseInput(inputData).run(10).rating()).toBe(2375);
    })

    it('attempts question two', () => {
        expect(parseInput(inputData).run(40).rating()).toBe(1976896901756);
    });

})