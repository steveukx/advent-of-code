import { neighbours } from '../__fixtures__';

describe('Year 2021: Day 11', () => {

    const miniData = `11111
19991
19191
19991
11111`;
    const sampleData = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;
    const inputData = `8624818384
3725473343
6618341827
4573826616
8357322142
6846358317
7286886112
8138685117
6161124267
3848415383`

    class Octopus {
        static FLASH: Set<Octopus> = new Set();

        private neighbours: Octopus[] = [];
        public readonly id: string;

        constructor(protected energy: number, public readonly x: number, public readonly y: number) {
            this.id = `${x}-${y}`;
        }

        proceed() {
            if (Octopus.FLASH.has(this)) {
                return this;
            }

            this.energy += 1;
            if (this.energy <= 9) {
                return this;
            }

            Octopus.FLASH.add(this);
            this.neighbours.forEach(octo => octo.proceed());
            this.energy = 0;

            return this;
        }

        withNeighbours(neighbours: Octopus[]) {
            this.neighbours = neighbours;
            return this;
        }
    }

    function inputToOctopuses(input: string) {
        const octos: Octopus[][] = [];
        const range = {x: 0, y: 0};

        for (let row of input.trim().split('\n')) {
            row = row.trim();
            if (!range.x) {
                range.x = row.length;
            }

            if (row.length !== range.x) {
                throw new Error(`Unexpected row length: ${range.x} != ${row.length}`);
            }

            range.y++;
            octos.push(row
                .split('')
                .map((energy, x) => new Octopus(Number(energy), x, octos.length))
            );
        }

        const map: Map<string, Octopus> = new Map();
        octos.forEach((row) => {
            row.forEach(octo =>
                map.set(octo.id, octo.withNeighbours(neighbours(octo.x, octo.y, octos)))
            );
        });

        return {
            octos,
            map,
        };
    }

    function bloom(map: Map<string, Octopus>, ticks = 1): number {
        Octopus.FLASH.clear();
        for (const octo of map.values()) {
            octo.proceed();
        }

        const flashes = Octopus.FLASH.size;
        return flashes + (ticks > 1 ? bloom(map, ticks - 1) : 0);
    }

    function lightning(map: Map<string, Octopus>, ticks = 1): number {
        Octopus.FLASH.clear();
        for (const octopus of map.values()) {
            octopus.proceed();
        }

        if (Octopus.FLASH.size === map.size) {
            return ticks;
        }

        return lightning(map, ticks + 1);
    }

    it('creates octopuses', () => {
        const {octos, map} = inputToOctopuses(miniData);

        expect(map.size).toBe(25);
        expect(map.get('0-0')).toBe(octos[0][0]);
        expect(map.get('3-4')).toBe(octos[4][3]);
    });

    it('blooms on mini data', () => {
        const {map} = inputToOctopuses(miniData);

        expect(bloom(map)).toBe(9);
        expect(bloom(map)).toBe(0);
    });

    it('blooms on sample data', () => {
        const {map} = inputToOctopuses(sampleData);

        expect(bloom(map, 10)).toBe(204);
    });

    describe('questions', () => {

        it('prepares for question one', () => {
            const {map} = inputToOctopuses(sampleData);

            expect(bloom(map, 100)).toBe(1656);
        });

        it('tries question one', () => {
            const {map} = inputToOctopuses(inputData);

            expect(bloom(map, 100)).toBe(1667);
        });

        it('prepares for question two', () => {
            const {map} = inputToOctopuses(sampleData);

            expect(lightning(map)).toBe(195);
        });

        it('tries question two', () => {
            const {map} = inputToOctopuses(inputData);

            expect(lightning(map)).toBe(488);
        });
    });

});