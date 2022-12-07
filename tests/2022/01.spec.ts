import { DESC, readInputFrom, sum, toStringArray } from '../__fixtures__';

describe('01', function () {
    function parse (input: string) {
        const elves: number[] = [0];
        for (const calories of toStringArray(input)) {
            if (calories) {
                elves[elves.length - 1] += parseInt(calories, 10);
            }
            else {
                elves.push(0);
            }
        }

        return elves;
    }

    it('ex0', () => {
        console.log(Math.max(...parse(`
            1000
            2000
            3000
            
            4000
            
            5000
            6000
            
            7000
            8000
            9000
            
            10000
        `)));
    });

    it('q1', () => {
        console.log(Math.max(...parse(readInputFrom(2022, 1, 'input'))));
    });

    it('q2', () => {
        console.log(
            sum(
                ...parse(readInputFrom(2022, 1, 'input')).sort(DESC).slice(0, 3)
            )
        );
    });
});