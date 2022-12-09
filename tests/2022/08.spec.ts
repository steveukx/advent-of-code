import { productOf, readInputFrom, toStringArray } from '../__fixtures__';

describe('08', function () {
    const example = `
30373
25512
65332
33549
35390
    `.trim();

    function parse(input: string) {
        const grid = toStringArray(input).map(row => row.split('').map(parseFloat));
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        const visible = new Set<string>();
        const add = (r: number, c: number) => visible.add(`${r}:${c}`);

        for (let r = 0; r < rows; r++) {
            // from left
            for (let c = 0, highest = -1; c < cols; c++) {
                const current = grid[r][c];
                if (current > highest) {
                    highest = current;
                    add(r, c);
                }

                if (current === 9) {
                    break;
                }
            }

            // from right
            for (let c = cols - 1, highest = -1; c >= 0; c--) {
                const current = grid[r][c];
                if (current > highest) {
                    highest = current;
                    add(r, c);
                }

                if (current === 9) {
                    break;
                }
            }
        }

        for (let c = 0; c < cols; c++) {
            // from top
            for (let r = 0, highest = -1; r < rows; r++) {
                const current = grid[r][c];
                if (current > highest) {
                    highest = current;
                    add(r, c);
                }

                if (current === 9) {
                    break;
                }
            }

            // from bottom
            for (let r = rows - 1, highest = -1; r >= 0; r--) {
                const current = grid[r][c];
                if (current > highest) {
                    highest = current;
                    add(r, c);
                }

                if (current === 9) {
                    break;
                }
            }
        }

        return {
            visible,
        }
    }

    function parseScenic(input: string) {
        const grid = toStringArray(input).map(row => row.split('').map(parseFloat));
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        let best = -1;
        const add = (score: number[]) => {
            const total = productOf(score);
            if (total > best) best = total;
        };

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const origin = grid[r][c];
                const score = [0, 0, 0, 0];

                for (let rr = r - 1; rr >= 0; rr--) {
                    score[0] += 1;
                    if (grid[rr][c] >= origin) break;
                }
                for (let rr = r + 1; rr < rows; rr++) {
                    score[1] += 1;
                    if (grid[rr][c] >= origin) break;
                }
                for (let cc = c - 1; cc >= 0; cc--) {
                    score[2] += 1;
                    if (grid[r][cc] >= origin) break;
                }
                for (let cc = c + 1; cc < cols; cc++) {
                    score[3] += 1;
                    if (grid[r][cc] >= origin) break;
                }

                add(score);
            }
        }

        return {
            best,
        }
    }

    it('eg1', () => {
        expect(parse(example).visible.size).toBe(21);
    });

    it('eg2', () => {
        expect(parseScenic(example).best).toBe(8);
    });

    it('q1', () => {
        console.log(
            parse(readInputFrom(2022, 8, 'input')).visible.size
        )
    });

    it('q2', () => {
        console.log(
            parseScenic(readInputFrom(2022, 8, 'input')).best
        )
    });


});