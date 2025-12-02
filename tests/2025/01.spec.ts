import { readInputFrom, wrapBetweenBounds } from '../__fixtures__';
import { sum } from 'lodash';

describe('01', () => {

    const sample = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
    `;

    type Task = {
        track: number, direction: 1 | -1, size: number, offset: number, dials: number
    };

    function parse(input: string, withDials: boolean, current = 50, max = 99, min = 0) {
        const tasks: Task[] = input.trim().split('\n').map(line => {
            const direction = line.charAt(0) === 'L' ? -1 : 1;
            const size = parseInt(line.substr(1), 10);

            return toTask(direction, size, max, min);
        });

        return sum(tasks.map((task) => {
            const {next, zeros} = detectZero(task, current, max, min);

            current = next;

            return withDials ? zeros : (next ? 0 : 1);
        }));
    }

    function detectZero({direction, size, offset, track}: Task, current = 50, max = 99, min = 0) {
        let zeros = 0;
        let bound = current + (direction * size);
        let next = wrapBetweenBounds(current, offset, min, max);

        if (bound > max) {
            zeros += 1 + Math.floor((bound - track) / track);
        }
        if (bound < min) {
            zeros += Math.floor((track - bound) / track) - (current === min ? 1 : 0);
        }
        if (bound === 0) {
            zeros += 1;
        }

        return {
            zeros,
            next,
        };
    }

    function toTask(direction: Task['direction'], size: number, max = 99, min = 0): Task {
        const track = 1 + max - min;
        const effective = size % track;
        const dials = Math.floor(size / track);

        return {
            direction,
            size,
            offset: direction * effective,
            dials,
            track,
        }
    }

    it('detect zeros', () => {
        expect(detectZero(toTask(-1, 1), 0)).toEqual({zeros: 0, next: 99});
        expect(detectZero(toTask(-1, 10))).toEqual({zeros: 0, next: 40});
        expect(detectZero(toTask(-1, 68))).toEqual({zeros: 1, next: 82});
        expect(detectZero(toTask(1, 60), 95)).toEqual({zeros: 1, next: 55});
        expect(detectZero(toTask(-1, 55), 55)).toEqual({zeros: 1, next: 0});
        expect(detectZero(toTask(1, 45), 55)).toEqual({zeros: 1, next: 0});
        expect(detectZero(toTask(1, 1000), 50)).toEqual({zeros: 10, next: 50});
    })

    it('samples.1', () => {
        expect(parse(sample, false)).toEqual(3);
    });

    it('samples.2', () => {
        expect(parse(sample, true)).toEqual(6);
    });

    it('one', () => {
        expect(parse(readInputFrom(2025, 1), false)).toEqual(1086);
    });

    it('two', () => {
        expect(parse(readInputFrom(2025, 1), true)).toEqual(6268);
    });

})