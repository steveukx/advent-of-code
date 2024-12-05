import { readInputFrom, toTabular } from '../__fixtures__';

describe('04', () => {
    const EXAMPLE = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`.trim();

    function parseV2(input: string) {
        const As: Array<{ x: number, y: number }> = [];
        const tabular = toTabular(input.trim(), (from, x, y) => {
            if (from === 'A') {
                As.push({x, y});
            }
            return from;
        });

        const xMASs = As.filter(({x, y}) => {
            return isMasCross(tabular.cols, x, y);
        });

        return {
            tabular,
            As,
            xMASs
        }
    }

    function parseV1(input: string) {
        const Xs: Array<{ x: number, y: number }> = [];
        const tabular = toTabular(input, (from, x, y) => {
            // const cell = new Cell(x, y, from);
            if (from === 'X') {
                Xs.push({x, y});
            }
            return from;
        });

        const XMASs = Xs.reduce((count, {x, y}) => {
            return count + Array.from(pathsFrom(tabular.cols, x, y, 4)).filter(str => str === 'XMAS').length;
        }, 0);

        return {
            XMASs,
            Xs,
            tabular,
        }
    }

    function isMasCross(cols: string[][], x, y) {
        const nwse = `${cols[x - 1]?.[y - 1] || ''}${cols[x]?.[y] || ''}${cols[x + 1]?.[y + 1] || ''}`;
        const swne = `${cols[x - 1]?.[y + 1] || ''}${cols[x]?.[y] || ''}${cols[x + 1]?.[y - 1] || ''}`;

        return isMas(nwse) && isMas(swne);
    }

    function isMas(input: string) {
        return input === 'MAS' || input === 'SAM';
    }

    function pathFrom(cols: string[][], x, y, dX, dY, len = 4): string {
        let result = cols[x]?.[y] || '';
        if (--len) {
            result += pathFrom(cols, x + dX, y + dY, dX, dY, len);
        }
        return result;
    }

    function* pathsFrom(cols: string[][], x, y, len = 4) {
        for (let dX = -1; dX <= 1; dX++) {
            for (let dY = -1; dY <= 1; dY++) {
                if (!dX && !dY) {
                    continue;
                }

                const path = pathFrom(cols, x, y, dX, dY, len);
                if (path.length === len) {
                    yield path;
                }
            }
        }
    }

    it('pathFrom', () => {
        const t = toTabular(`
abcdefg
hijklmn
opqrstu
vwxyzAB
CDEFGHI
        `.trim(), (str) => str
        );

        expect(Array.from(pathsFrom(t.cols, 2, 2, 2))).toEqual([
            'qi', 'qp', 'qw', 'qj', 'qx', 'qk', 'qr', 'qy'
        ]);
        expect(Array.from(pathsFrom(t.cols, 0, 0, 2))).toEqual([
            'ah', 'ab', 'ai'
        ]);
    })

    it('example.1', () => {
        expect(parseV1(EXAMPLE).XMASs).toBe(18)
    });
    it('question.1', () => {
        expect(parseV1(readInputFrom(2024, 4, 'input')).XMASs).toBe(2507)
    });
    it('example.2', () => {
        expect(parseV2(EXAMPLE).xMASs).toHaveLength(9)
    });
    it('question.2', () => {
        expect(parseV2(readInputFrom(2024, 4, 'input')).xMASs).toHaveLength(1969)
    });
})
