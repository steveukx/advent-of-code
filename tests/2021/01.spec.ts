import { readInputFrom, sum } from '../__fixtures__';

describe('Year 2021: Day 1', () => {
    const sample = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

    function inputToWindows(data: number[]) {
        return data.reduce((collector, _current, index) => {
            if (index < data.length - 2) {
                collector.push(sum(...data.slice(index, index + 3)));
            }
            return collector;
        }, [] as number[]);
    }

    function increaseDecreaseCollector(result: IncreaseDecrease, current: number) {
        return result.next(current);
    }

    class IncreaseDecrease {
        public current?: number;
        increased = 0;
        decreased = 0;

        next(next: number) {
            if (this.current !== undefined && this.current !== next) {
                next > this.current ? this.increased += 1 : this.decreased += 1;
            }

            this.current = next;
            return this;
        }
    }

    it('counts increases and decreases', () => {
        expect([1, 2, 1, 3, 4, 1].reduce(increaseDecreaseCollector, new IncreaseDecrease()))
            .toEqual(expect.objectContaining({increased: 3, decreased: 2}))
    });

    it('caters for no-change neighbours', () => {
        expect([1, 2, 1, 1, 4, 4].reduce(increaseDecreaseCollector, new IncreaseDecrease()))
            .toEqual(expect.objectContaining({increased: 2, decreased: 1}))
    });

    it('windows data', () => {
        expect(inputToWindows([1, 2, 1, 3, 4, 2])).toEqual([4, 6, 8, 9]);
    });


    describe('questions', () => {

        function getIncrementCount(data: number[]) {
            return data.reduce(increaseDecreaseCollector, new IncreaseDecrease()).increased;
        }

        it('confirms the sample for question one', () => {
            expect(getIncrementCount(sample)).toBe(7);
        });

        it('gets one gold star', () => {
            expect(getIncrementCount(numbersFromInput())).toBe(1387);
        });

        it('confirms the sample for question two', () => {
            expect(getIncrementCount(inputToWindows(sample))).toBe(5);
        });

        it('gets second gold star', () => {
            expect(getIncrementCount(inputToWindows(numbersFromInput()))).toBe(1362);
        });

        function numbersFromInput() {
            return readInputFrom(2021, 1, 'input')
                .trim()
                .split('\n')
                .map(n => parseInt(n, 10));
        }
    });
});