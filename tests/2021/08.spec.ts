import { anArray, onlyIn, readInputFrom, without } from '../__fixtures__';

describe('Year 2021: Day 8', () => {

    const inputData = readInputFrom(2021, 8, 'input');
    const sampleData = readInputFrom(2021, 8, 'sample');

    type TDigits = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
    const ALL = 'abcdefg'.split('') as TDigits[];
    const UNIQUE_COUNTS = new Map([[2, 1], [3, 7], [4, 4], [7, 8]]);

    const MAPPED = {
        abcefg: 0,
        cf: 1,
        acdeg: 2,
        acdfg: 3,
        bcdf: 4,
        abdfg: 5,
        abdefg: 6,
        acf: 7,
        abcdefg: 8,
        abcdfg: 9,
    }

    class Display {
        private map: Map<TDigits, TDigits> = new Map();
        private reverse: Map<string, string> = new Map();

        set(where: TDigits, as: TDigits) {
            this.map.set(where, as);
            return this;
        }

        at(where: TDigits): TDigits | undefined {
            return this.map.get(where);
        }

        parseA(segments: Array<TDigits[][]>) {
            const remainder = without(segments[3][0], segments[2][0]);

            return this.set('a', onlyIn(remainder));
        }

        parseSix(segments: Array<TDigits[][]>) {
            const one = segments[2][0];
            const four = segments[4][0];
            const seven = segments[3][0];

            // nine wholly contains four
            const nine = segments[6].find(segment => !without(four, segment).length)!;

            this.set('g', onlyIn(without(nine, [...four, ...seven])));
            this.set('e', onlyIn(without(ALL, nine)));

            // zero wholly contains seven
            const zero = segments[6].find(segment => segment !== nine && !without(seven, segment).length)!;
            const six = segments[6].find(segment => segment !== zero && segment !== nine)!;

            this.set('c', onlyIn(without(ALL, six)));
            this.set('d', onlyIn(without(four, zero)));
            this.set('f', onlyIn(without(one, [this.at('c')!])));
            this.set('b', onlyIn(without(ALL, Array.from(this.map.values()))));

            this.reverse = new Map(
                Array.from(this.map.entries(), ([k, v]) => [v, k]) as any
            );

            expect(this.reverse.size).toBe(this.map.size);
        }

        from(disp: string[]) {
            const mapped = disp.map(c => this.reverse.get(c)!).sort().join('');
            if (!(mapped in MAPPED)) throw new Error(`Unknown mapping: ${mapped}`);

            return MAPPED[mapped as keyof typeof MAPPED];
        }
    }

    function codeFromInput(input: string) {
        let counter = 0;
        const displays = input.split('\n');
        displays.forEach(src => {
            src.replace(/^.+\| /, '').split(' ').every((sequence) => {
                if (UNIQUE_COUNTS.has(sequence.length)) {
                    counter++;
                }

                return true;
            });
        });

        return counter;
    }

    function solveDisplay(input: string) {
        const [sample, numbers] = input.split(' | ');

        const sequences = sample.split(' ')
            .sort(({length: aLen}, {length: bLen}) => {
                if (UNIQUE_COUNTS.has(aLen) === UNIQUE_COUNTS.has(bLen)) return bLen - aLen;
                return UNIQUE_COUNTS.has(aLen) ? -1 : 1;
            });

        const segments = anArray<TDigits[][]>(8, () => []);

        for (const sequence of sequences) {
            segments[sequence.length].push(sequence.split('') as TDigits[]);
        }

        const display = new Display();
        display.parseA(segments);
        display.parseSix(segments);

        const output = numbers.split(' ').map(num => {
            const ordered = num.split('').sort();
            return display.from(ordered);
        }).join('');

        return {
            display,
            output,
            value: Number(output),
        };
    }

    function valueFromInput(input: string) {
        return input.split('\n').reduce((value, line) => {
            return value + solveDisplay(line).value;
        }, 0);
    }

    it('resolves a display', () => {
        const display = solveDisplay('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf');
        expect(display.value).toBe(5353);
    });

    describe('questions', () => {
        it('prepares for question one', () => {
            expect(codeFromInput(sampleData)).toBe(26)
        });

        it('gets one gold star', () => {
            expect(valueFromInput(inputData)).toBe(1031553);
        });

        it('prepares for question two', () => {
            expect(valueFromInput(sampleData)).toBe(61229);
        });

        it('gets second gold star', () => {
            expect(codeFromInput(inputData)).toBe(369)
        });
    })
})