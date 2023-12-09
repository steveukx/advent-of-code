import { readInputFrom, sumOf, toLines } from '../__fixtures__';

describe('09', function () {
    const INPUT = readInputFrom(2023, 9, 'input');
    const EXAMPLE = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

    function gaps(numbers: number[]) {
        const out: number[] = [];
        for (let i = 1; i < numbers.length; i++) {
            out.push(numbers[i] - numbers[i-1]);
        }

        expect(out).toHaveLength(numbers.length - 1);
        return out;
    }

    class Sequence {
        public readonly child?: Sequence;

        constructor(private numbers: number[]) {
            expect(numbers.length).toBeGreaterThan(0);
            if (numbers.some(Boolean)) {
                this.child = new Sequence(gaps(numbers));
            }
        }

        tail () {
            return this.numbers.at(-1)!;
        }

        head () {
            return this.numbers.at(0)!;
        }

        next (): number {
            if (!this.child) {
                return 0;
            }

            return this.tail() + this.child.next();
        }

        prev (): number {
            if (!this.child) {
                return 0;
            }

            return this.head() - this.child.prev();
        }
    }

    function parse(input: string) {
        const lines = toLines(input);
        const history = lines.map(line => {
            return new Sequence(line.split(' ').map(Number));
        });

        const next = history.map(h => {
            return h.next()
        });

        return { history, next, result: sumOf(next) }
    }

    function backward (history: Sequence[]) {
        const prev = history.map(h => h.prev());

        return { prev, result: sumOf(prev) }
    }

    it('ex1', () => {
        expect(parse(EXAMPLE).result).toBe(114);
    })

    it('ex2', () => {
        expect(backward(parse(EXAMPLE).history).result).toBe(2);
    })

    it('q1', () => {
        console.log(parse(INPUT).result);
    });

    it('q2', () => {
        console.log(backward(parse(INPUT).history).result);
    });
});