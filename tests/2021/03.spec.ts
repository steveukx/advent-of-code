import { anArray, readInputFrom, toLines } from '../__fixtures__';

describe('Year 2021: Day 3', () => {

    type Bit = '1' | '0';

    function bitsToCounts(input: string) {
        const inputs = toLines(input);
        const counters: BitCounter[] = anArray(inputs[0].length, () => new BitCounter());

        inputs.forEach(chars => {
            chars.split('').forEach((char, index) => counters[index].next(char as Bit));
        })

        return counters
    }

    class BitCounter {
        zero = 0;
        one = 0;

        next(bit: Bit) {
            bit === '1' ? this.one++ : this.zero++;
        }
    }

    class EpsilonGamma {
        gamma = '';
        epsilon = '';

        get power() {
            return parseInt(this.gamma, 2) * parseInt(this.epsilon, 2);
        }

        next(bit: BitCounter) {
            const gammaD: Bit = bit.zero > bit.one ? '0' : '1';
            const epsilonD: Bit = bit.zero > bit.one ? '1' : '0';

            this.gamma += gammaD;
            this.epsilon += epsilonD;

            return this;
        }

        static fromCounts(counts: BitCounter[]) {
            return counts.reduce((eg, count) => eg.next(count), new EpsilonGamma());
        }
    }

    class Oxygen {
        constructor(protected bits: string[]) {
        }

        get result() {
            if (this.bits.length !== 1) {
                throw new Error(`Retrieving result on ${this.bits.length} items - filtering required`);
            }

            return parseInt(this.bits[0], 2);
        }

        protected splitBits(index: number) {
            const zeros: string[] = [], ones: string[] = [];
            this.bits.forEach(item => (item[index] === '1' ? ones : zeros).push(item));

            return {zeros, ones};
        }

        protected pick({zeros, ones}: { zeros: string[], ones: string[] }) {
            if (!(zeros.length * ones.length)) return zeros.length && zeros || ones;
            if (zeros.length != ones.length) return zeros.length > ones.length ? zeros : ones;
            return ones;
        }

        next(charIndex: number) {
            this.bits = this.pick(this.splitBits(charIndex));

            return this;
        }

        process() {
            const steps = this.bits[0].length;
            for (let i = 0; this.bits.length > 1 && i < steps; i++) {
                this.next(i);
            }

            return this;
        }
    }

    class CO2 extends Oxygen {
        protected pick({zeros, ones}: { zeros: string[], ones: string[] }) {
            if (!(zeros.length * ones.length)) return zeros.length && zeros || ones;

            if (zeros.length != ones.length) return zeros.length < ones.length ? zeros : ones;
            return zeros;
        }
    }

    function lifeSupport(input: string) {
        const lines = toLines(input);
        return new Oxygen(lines).process().result * new CO2(lines).process().result;
    }

    it('counts bits', () => {
        expect(bitsToCounts('0101\n0001')).toEqual([
            expect.objectContaining({zero: 2, one: 0}),
            expect.objectContaining({zero: 1, one: 1}),
            expect.objectContaining({zero: 2, one: 0}),
            expect.objectContaining({zero: 0, one: 2}),
        ])
    });

    it('creates epsilons and gammas', () => {
        const actual = new EpsilonGamma();
        const one = new BitCounter();
        one.next('1');
        const zero = new BitCounter();
        zero.next('0');

        actual.next(one);
        expect(actual).toEqual(expect.objectContaining({epsilon: '0', gamma: '1', power: 0}));

        actual.next(zero);
        expect(actual).toEqual(expect.objectContaining({epsilon: '01', gamma: '10', power: 2}));

        actual.next(one);
        expect(actual).toEqual(expect.objectContaining({epsilon: '010', gamma: '101', power: 10}));
    });


    it('determines oxygen', () => {
        const oxygen = new Oxygen(['10111', '10110']).process();
        expect(oxygen.result).toBe(23);
    });

    it('determines co2', () => {
        const co2 = new CO2(['10111', '11111', '01010']).process();
        expect(co2.result).toBe(10);
    });

    describe('questions', () => {
        const sample = readInputFrom(2021, 3, 'sample');
        const input = readInputFrom(2021, 3, 'input');

        it('prepares for question one', () => {
            const counts = bitsToCounts(sample);

            expect(EpsilonGamma.fromCounts(counts).power).toBe(198);
        });

        it('gets one gold star', () => {
            const counts = bitsToCounts(input);

            expect(EpsilonGamma.fromCounts(counts).power).toBe(1997414);
        });

        it('prepares for question two', () => {
            expect(lifeSupport(sample)).toBe(230);
        });

        it('gets two gold stars', () => {
            expect(lifeSupport(input)).toBe(1032597);
        });
    });

});