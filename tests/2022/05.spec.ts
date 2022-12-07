import { readInputFrom, toStringArray } from '../__fixtures__';

describe('05', function () {

    const ex = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
    `;

    function parseStacks (input: string[]) {
        const stacks: string[][] = [];
        while (input.length) {
            const line = input.shift()!;
            if (/^[\s\d]+$/.test(line)) {
                break;
            }

            const regex = /\[(.)]/g;
            while (true) {
                const match = regex.exec(line);
                if (!match) {
                    break;
                }

                const index = Math.floor(match.index / 4);
                const stack = stacks[index] || (stacks[index] = []);
                stack.push(match[1]);
            }
        }

        return {
            stacks,
            input,
        }
    }

    function operate (stacks: string[][], operation: string, reverse: boolean) {
        const [count, from, to] = Array.from(operation.match(/\d+/g) || [], parseFloat);
        if (!count) return;

        const remove = stacks[from - 1].splice(0, count);

        count && stacks[to - 1].unshift(
            ...(reverse ? remove.reverse() : remove),
        );
    }

    function parse (data: string, reverse = true) {
        const {stacks, input} = parseStacks(toStringArray(data, false));

        input.forEach(line => operate(stacks, line, reverse));

        return stacks;
    }

    function getStackTops (stacks: string[][]) {
        return stacks.map(stack => stack.at(0)).join('');
    }

    it('ex1', () => {
        console.log(
            getStackTops(
                parse(ex),
            ),
        );
    });

    it('ex2', () => {
        console.log(
            getStackTops(
                parse(ex, false),
            ),
        );
    });


    it('q1', () => {
        expect(
            getStackTops(
                parse(readInputFrom(2022, 5, 'input')),
            ),
        ).toBe('TQRFCBSJJ');
    });

    it('q2', () => {
        console.log(
            getStackTops(
                parse(readInputFrom(2022, 5, 'input'), false),
            ),
        );
    });

});