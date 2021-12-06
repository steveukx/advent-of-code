import { readInputFrom, toLines } from '../__fixtures__';

describe('Year 2021: Day 2', () => {

    class Navigation {
        depth = 0;
        forwards = 0;

        protected onForward(size: number) {
            this.forwards += size;
        }

        protected onUp(size: number) {
            this.depth -= size;
        }

        protected onDown(size: number) {
            this.depth += size;
        }

        next(action: string) {
            const [_, behaviour, distance] = /^\s*(forward|up|down) (\d+)/.exec(action) || [, '', '0'];
            const size = parseInt(distance!, 10);

            switch (behaviour) {
                case 'forward':
                    this.onForward(size);
                    break;
                case 'up':
                    this.onUp(size);
                    break;
                case 'down':
                    this.onDown(size);
                    break;
            }

            return this;
        }

        get result() {
            return this.depth * this.forwards;
        }
    }

    class NavigationWithAim extends Navigation {
        aim = 0;

        protected onForward(size: number) {
            this.forwards += size;
            this.depth += this.aim * size;
        }

        protected onDown(size: number) {
            this.aim += size;
        }

        protected onUp(size: number) {
            this.aim -= size;
        }
    }

    function navigate(inputs: string) {
        return toLines(inputs).reduce(
            (navigation: Navigation, input) => navigation.next(input),
            new Navigation(),
        );
    }

    function navigateWithAim(inputs: string) {
        return toLines(inputs).reduce(
            (navigation: Navigation, input) => navigation.next(input),
            new NavigationWithAim(),
        );
    }

    it('navigates with known actions', () => {
        expect(navigate('forward 10\ndown 5')).toEqual(expect.objectContaining({
            depth: 5,
            forwards: 10,
            result: 50,
        }));
    });

    describe('questions', () => {
        const sample = readInputFrom(2021, 2, 'sample');
        const input = readInputFrom(2021, 2, 'input');

        it('prepares for question one', () => {
            expect(navigate(sample).result).toBe(150);
        });

        it('gets one gold star', () => {
            expect(navigate(input).result).toBe(1868935);
        });

        it('prepares for question two', () => {
            expect(navigateWithAim(sample).result).toBe(900);
        });

        it('gets second gold star', () => {
            expect(navigateWithAim(input).result).toBe(1965970888);
        });
    })

});