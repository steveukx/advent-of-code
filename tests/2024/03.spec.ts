import { productOf, readInputFrom } from '../__fixtures__';

describe('03', () => {
    type Token = `mul(number,number)`;
    type Command = `do()` | `don't()`;
    const EXAMPLE_1 = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))\n`;
    const EXAMPLE_2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

    function isCommand(input: string): input is Command {
        return input.charAt(0) === 'd';
    }

    function parserV1(input: string) {
        const regex = /mul\((\d{1,3}),(\d{1,3})\)/g
        const matches: Token[] = input.match(regex) || [];
        return matches.reduce((sum, token) => {
            const values = (token.match(/(\d{1,3}),(\d{1,3})/) || []).slice(1).map(Number);
            return sum + productOf(values);
        }, 0);
    }

    function parserV2(input: string) {
        const regex = /(do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\))/g;
        const matches: Array<Token | Command> = input.match(regex) || [];

        let collecting = true;
        return matches.reduce((sum, token) => {
            if (isCommand(token)) {
                collecting = token === 'do()';
                return sum;
            }
            if (!collecting) {
                return sum;
            }
            const values = (token.match(/(\d{1,3}),(\d{1,3})/) || []).slice(1).map(Number);
            return sum + productOf(values);
        }, 0);
    }

    it('example.1', () => {
        expect(parserV1(EXAMPLE_1)).toBe(161);
    });

    it('example.2', () => {
        expect(parserV2(EXAMPLE_2)).toBe(48)
    });

    it('question.1', () => {
        expect(parserV1(readInputFrom(2024, 3, 'input'))).toBe(167650499);
    });

    it('question.2', () => {
        expect(parserV2(readInputFrom(2024, 3, 'input'))).toBe(95846796)
    });
})