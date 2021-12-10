import { readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 10', () => {

    type TOnIncomplete = (open: string[]) => number;
    type TOnError = (error: string) => number;

    const sampleData = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

    const CHUNKS: Record<string, string> = {
        '{': '}',
        '[': ']',
        '(': ')',
        '<': '>',
    };

    const ERROR_SCORES: Record<string, number> = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    };

    const AUTOCOMPLETE_SCORES: Record<string, number> = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    };

    function ignore() {
        return 0;
    }

    function getErrorScore(error: string) {
        return ERROR_SCORES[error];
    }

    function getAutoCompleteScore(open: string[]) {
        return open.reduce((count, char) => (count * 5) + AUTOCOMPLETE_SCORES[char], 0);
    }

    function validInputLine(line: string, onError: TOnError, onIncomplete: TOnIncomplete) {
        const open: string[] = [];

        for (let i = 0, max = line.length; i < max; i++) {
            const char = line[i];
            if (CHUNKS.hasOwnProperty(char)) {
                open.unshift(CHUNKS[char]);
                continue;
            }

            if (char === open[0]) {
                open.shift();
                continue;
            }

            return onError(char);
        }

        return open.length ? onIncomplete(open) : 0;
    }

    function errorPoints(input: string) {
        return input.split('\n').reduce(
            (count, line) => count + validInputLine(line, getErrorScore, ignore),
            0
        );
    }

    function autoCompletePoints(input: string) {
        const lineScores: number[] = [];

        input.split('\n').forEach(line => {
            const count = validInputLine(line, ignore, getAutoCompleteScore);
            if (count) {
                lineScores.push(count);
            }
        });

        return lineScores.sort((a, b) => a - b)[Math.floor(lineScores.length / 2)];
    }

    it('prepares for question one', () => {
        expect(errorPoints(sampleData)).toBe(26397);
    });

    it('prepares for question two', () => {
        expect(autoCompletePoints(sampleData)).toBe(288957);
    });

    it('gets one gold star', () => {
        expect(errorPoints(readInputFrom(2021, 10, 'input'))).toBe(387363);
    });

    it('gets second gold star', () => {
        expect(autoCompletePoints(readInputFrom(2021, 10, 'input'))).toBe(4330777059);
    });

})