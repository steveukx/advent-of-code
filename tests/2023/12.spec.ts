import { neighbours, readInputFrom, toGrid, toLines } from '../__fixtures__';
import { Cell, fromGrid, Grid } from '../__fixtures__/toGrid';

describe('09', function () {
    const INPUT = readInputFrom(2023, 12, 'input');
    const EXAMPLE = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

    function parseLineA (line: string) {
        const [input, brokenInput] = line.split(' ');
        const broken = brokenInput.split(',').map(Number);
        const options = input.split('').reduce((all, char) => {
            if ('.#'.includes(char)) {
                return all.map(was => `${was}${char}`);
            }

            if (!all.length) {
                return ['.', '#'];
            }

            return all.flatMap(was => {
                return [`${was}.`, `${was}#`];
            });
        }, [] as string[]);

        return {
            options, broken
        };
    }

    function parse(input: string, parseLine = parseLineA) {
        const lines = toLines(input).map(parseLine);

        return {
            lines,
        };
    }

    it('ex1', () => {
        expect(parse('???.### 1,1,3')).toHaveLength(8);
    })

    it('ex2 a', () => {
        const parsed = parse(EXAMPLE);
        const borders = new Set(
            path(parsed).map(c => c.key)
        );
        const enc = enclosure(parsed, borders);

        expect(enc.size).toBe(1);
    });

    it('ex2 b', () => {
        const parsed = parse(INPUT);
        // const borders = new Set(
        //     path(parsed).map(c => c.key)
        // );
        // const enc = enclosure(parsed, borders);


        console.log(
            fromGrid(
                redraw(parsed, new Set(path(parsed)))
            )
        )


    })

    it('q1', () => {
        console.log(path(parse(INPUT)).length / 2);
    });

    it('q2', () => {
        const parsed = parse(INPUT);
        const borders = new Set(
            path(parsed).map(c => c.key)
        );
        const enc = enclosure(parsed, borders);

        console.log(enc.size);
    });
});