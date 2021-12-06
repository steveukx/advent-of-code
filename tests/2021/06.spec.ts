import { readInputFrom, sum } from '../__fixtures__';

describe('Year 2021: Day 6', () => {

    function shoal (input: string) {
        let fish: number[] = dawn();
        let day = 0;

        input.split(',').forEach(current => {
            const timer = parseInt(current, 10);
            fish[timer] = (fish[timer] || 0) + 1;
        });

        function tick (count = 1) {
            day++;
            const nextDay = dawn();

            for (let i = 1; i < fish.length; i++) {
                nextDay[i - 1] = fish[i];
            }

            nextDay[6] += (nextDay[8] = fish[0]);

            fish = nextDay;

            if (count > 1) {
                tick(count - 1);
            }

            return api;
        }

        function dawn () {
            return Array(9).fill(0);
        }

        const api = {
            get day () {
                return day;
            },
            get fish () {
                return fish;
            },
            get size () {
                return sum(...fish);
            },
            tick,
        };

        return api;
    }

    it('creates a shoal', () => {
        expect(shoal('1,3,3').fish).toEqual([0, 1, 0, 2, 0, 0, 0, 0, 0])
    });

    it('spawns on a new day', () => {
        const actual = shoal('1,3,3');

        actual.tick();
        expect(actual).toEqual(expect.objectContaining({ day: 1, fish: [1, 0, 2, 0, 0, 0, 0, 0, 0] }));

        actual.tick();
        expect(actual).toEqual(expect.objectContaining({ day: 2, fish: [0, 2, 0, 0, 0, 0, 1, 0, 1] }));

        actual.tick();
        actual.tick();
        expect(actual).toEqual(expect.objectContaining({ day: 4, fish: [ 0, 0, 0, 0, 1, 0, 3, 0, 2] }));
    });

    it('counts the fish', () => {
        const actual = shoal('1,0,4');

        expect(actual.size).toBe(3);

        actual.tick();
        expect(actual.size).toBe(4);
    });

    describe('questions', () => {
        it('prepares for question one', () => {
            const data = '3,4,3,1,2';
            expect(shoal(data).tick(18).size).toBe(26);
            expect(shoal(data).tick(80).size).toBe(5934);
        });

        it('gets one gold star', () => {
            const data = readInputFrom(2021, 6, 'input');
            expect(shoal(data).tick(80).size).toBe(362666);
        });

        it('prepares for question two', () => {
            const data = '3,4,3,1,2';
            expect(shoal(data).tick(256).size).toBe(26984457539);
        });

        it('gets second gold star', () => {
            const data = readInputFrom(2021, 6, 'input');
            expect(shoal(data).tick(256).size).toBe(1640526601595);
        });


    })

})