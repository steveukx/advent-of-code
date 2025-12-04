import { neighbours, readInputFrom, toTabular } from '../__fixtures__';

describe('04', () => {
    const sample = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`.trim();

    type Carpet = {
        from: string;
        carpet: boolean;
        x: number;
        y: number;
        neighbours: Set<Carpet>;
    }

    function step(grid: Carpet[][], carpets: Set<Carpet>) {
        const remove = (carpet: Carpet) => {
            carpet.carpet = false;
            carpets.delete(carpet);
        }

        const positions = new Set<Carpet>();
        for (const carpet of carpets) {
            if (!carpet.carpet) {
                remove(carpet);
            }
            else if (neighbours(carpet.x, carpet.y, grid).filter(n => n.carpet).length < 4) {
                positions.add(carpet);
                remove(carpet);
            }
        }

        return positions.size;
    }

    function parse(input: string) {
        const {grid} = toTabular<Carpet>(
            input,
            function (from, x, y) {
                return {
                    from,
                    x, y,
                    carpet: from === '@',
                    neighbours: new Set,
                };
            }
        );

        return [grid, new Set(grid.flat())];
    }

    function parseOne(input: string) {
        return step(...parse(input));
    }

    function parseTwo(input: string) {
        const [grid, carpets] = parse(input);
        let removed = 0;

        let positions = 0;
        while (positions = step(grid, carpets)) {
            removed += positions;
        }

        return removed;
    }

    it('s1', () => {
        expect(parseOne(sample)).toEqual(13)
    });

    it('s2', () => {
        expect(parseTwo(sample)).toEqual(43)
    });

    it('e1', () => {
        expect(parseOne(readInputFrom(2025, 4))).toEqual(1428)
    });

    it('e2', () => {
        expect(parseTwo(readInputFrom(2025, 4))).toEqual(8936)
    });

});