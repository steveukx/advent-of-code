import { readInputFrom, toLines } from '../__fixtures__';

describe('04', function () {
    const INPUT = readInputFrom(2023, 5, 'input');
    const EXAMPLE = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

    class Range {
        constructor(
            public readonly base: number,
            public readonly start: number,
            public readonly count: number,
        ) {
        }

        has (test: number) {
            return test >= this.start && test < (this.start + this.count);
        }

        map (test: number) {
            return this.base + (test - this.start);
        }
    }

    class Conversion {
        public readonly ranges: Range[] = [];
        constructor(
            public readonly from: string,
            public readonly to: string,
        ) {
        }
    }

    function lowest(inputs: number[]) {
        let index = 0;
        let value = inputs[0];

        for (let i = 1; i <= inputs.length; i++) {
            if (inputs[i] < value) {
                index = i;
                value = inputs[i];
            }
        }

        return {index, value};
    }

    class Almanac {
        seeds: number[] = [];
        conversions: Conversion[] = [];

        convert (seed: number) {
            let converted = seed;
            for (const conversion of this.conversions) {
                for (const range of conversion.ranges) {
                    if (range.has(converted)) {
                        converted = range.map(converted);
                        break;
                    }
                }
            }

            return converted;
        }

        closestLocation () {
            const locations = this.seeds.map(seed => this.convert(seed));
            return lowest(locations).value;
        }

        closestSeedRangeLocation() {
            let closest = Infinity;
            let attempt = 0;
            let attemptCount = 0;

            for (let i = 0; i < this.seeds.length; i += 2) {
                for (let j = this.seeds[i], max = j + this.seeds[i + 1]; j < max; j++) {
                    const location = this.convert(j);
                    if (location < closest) {
                        closest = location;
                    }

                    if (attempt++ === 25000) {
                        console.log(`Iterations: ${attemptCount++}x25,000`);
                        attempt = 0;
                    }
                }
            }

            return closest;
        }
    }

    function parse(input: string, parseSeeds = parseSeedsA) {
        const almanac = new Almanac();
        const lines = toLines(input);
        let seeds: number[] | undefined;
        let conversion: Conversion | undefined;

        while (lines.length) {
            const line = lines.shift()!;
            if (!seeds) {
                almanac.seeds.push(...(seeds = parseSeeds(line)));
            }
            else if (!line) {
                conversion = undefined;
            }
            else if (line.includes(' map:')) {
                almanac.conversions.push(
                    conversion = parseConversion(line)
                );
            }
            else {
                conversion!.ranges.push(parseRange(line));
            }
        }

        function parseRange(line: string) {
            const numbers = line.split(' ').map(Number);
            return new Range(numbers[0], numbers[1], numbers[2]);
        }

        function parseConversion(line: string) {
            const names = /^([a-z]+)-to-([a-z]+)/.exec(line);
            if (!names) throw new Error(`Cannot parse conversion ${line}`);

            return new Conversion(names[1], names[2]);
        }

        return almanac;
    }

    function parseSeedsA (line: string) {
        return line.split(' ').slice(1).map(Number);
    }

    it('ex1', () => {
        expect(parse(EXAMPLE).closestLocation()).toBe(35);
    })

    it('ex2', () => {
      expect(parse(EXAMPLE).closestSeedRangeLocation()).toBe(46);
    })


    it('q1', () => {
        console.log(parse(INPUT).closestLocation());
    });

    it('q2', () => {
        console.log(parse(INPUT).closestSeedRangeLocation());
    });
});