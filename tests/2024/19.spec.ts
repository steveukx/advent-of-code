import { append, toLines } from '../__fixtures__';

describe('19', () => {
    const EXAMPLE = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

    function parse(input: string){
        const [_towels, , ...patterns] = toLines(input);
        const towels = _towels.split(', ');

        towels.sort((a, b) => a.length - b.length);
        patterns.sort((a, b) => a.length - b.length);

        const map = towels.reduce((all, towel) => {
            const chr = towel.charAt(0);
            return all.set(chr, append(all.get(chr), towel));
        }, new Map<string, string[]>())

        return {
            patterns,
            towels,
            map,
        }
    }

    function valid(pattern: string, towels: string[]) {
        const possible = towels.filter(towel => pattern.includes(towel));

        for (let i = possible.length - 1; i >= 0; i--) {
            const where = pattern.indexOf(possible[i]);
            if (where >= 0) {
                pattern = pattern.substring(0, where) + pattern.substring(where + possible[i].length);
            }

            if (!pattern) {
                return true;
            }
        }

        return false;
    }

    it('example.1', () => {
        const p = parse(EXAMPLE);
        debugger

        expect(valid('brwrr', p.towels)).toBe(true);
    })

})