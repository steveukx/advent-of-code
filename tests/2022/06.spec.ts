import { readInputFrom } from '../__fixtures__';

describe('06', function () {

    const example = new Map([
        [`bvwbjplbgvbhsrlpgdmjqwftvncz`, 5],
        [`nppdvjthqldpwncqszvftbrmjlhg`, 6],
        [`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, 10],
        [`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`, 11],
    ]);

    function marker (input: string, size = 1) {
        for (let i = size, max = input.length; i < max; i++) {
            if (new Set(input.substring(i - size, i)).size === size) {
                return i;
            }
        }
        return -1;
    }

    it('ex1', () => {
        example.forEach((expected, key) => {
            expect(marker(key, 4)).toBe(expected);
        })
    });

    it('q1', ()=> {
        expect(marker(readInputFrom(2022, 6, 'input'), 4)).toBe(1134)
    })

    it('q2', ()=> {
        expect(marker(readInputFrom(2022, 6, 'input'), 14)).toBe(2263)
    })
});