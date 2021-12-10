import { productOf, readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 9', () => {

    const inputData = readInputFrom(2021, 9, 'input');
    const sampleData = `2199943210
3987894921
9856789892
8767896789
9899965678`;

    function parseMap(map: string) {
        const range = {x: 0, y: 0};
        const points: number[][] = [];

        for (let row of map.trim().split('\n')) {
            row = row.trim();
            if (!range.x) {
                range.x = row.length;
            }

            if (row.length !== range.x) {
                throw new Error(`Unexpected row length: ${range.x} != ${row.length}`);
            }

            range.y++;
            points.push(row.split('').map(Number));
        }

        return new Risk(points);
    }

    class Risk {

        constructor(public points: number[][]) {
        }

        risk() {
            let count = 0;
            for (let y = 0; y < this.points.length; y++) {
                for (let row = this.points[y], x = 0; x < row.length; x++) {
                    count += this.riskAt(x, y);
                }
            }

            return count;
        }

        riskAt(x: number, y: number) {
            const point = this.points[y][x];
            if (this.neighbours(x, y).some(other => other <= point)) {
                return 0;
            }

            return point + 1;
        }

        has(x: number, y: number) {
            return {
                above: y > 0,
                below: y < this.points.length - 1,
                left: x > 0,
                right: x < (this.points[y].length - 1),
            };
        }

        neighbours(x: number, y: number) {
            const out: number[] = [];
            const {above, below, left, right} = this.has(x, y);

            if (left) out.push(this.points[y][x - 1]);
            if (right) out.push(this.points[y][x + 1]);

            if (above) out.push(...this.points[y - 1].slice(
                left ? x - 1 : x,
                right ? x + 2 : x + 1,
            ));

            if (below)
                out.push(...this.points[y + 1].slice(
                    left ? x - 1 : x,
                    right ? x + 2 : x + 1,
                ));

            return out;
        }

        lows() {
            let lows: number[] = [];
            const basins: Array<{ x: number, y: number, size: number }> = [];

            for (let y = 0; y < this.points.length; y++) {
                for (let row = this.points[y], x = 0; x < row.length; x++) {
                    if (this.riskAt(x, y)) {
                        lows.push(x + (row.length * y));
                        basins.push(this.basin(x, y));
                    }
                }
            }

            return {
                lows,
                basins,
                biggest: productOf([...basins].sort((a, b) => b.size - a.size).slice(0, 3).map(b => b.size))
            };
        }

        basin(x: number, y: number, found = new Set<string>()) {
            const key = `${x}:${y}`;

            if (found.has(key) || this.points[y][x] === 9) {
                return {
                    x, y, size: found.size
                }
            }

            found.add(key);
            const {above, below, left, right} = this.has(x, y);
            left && this.basin(x - 1, y, found);
            right && this.basin(x + 1, y, found);
            above && this.basin(x, y - 1, found);
            below && this.basin(x, y + 1, found);


            return {
                x, y, size: found.size
            }
        }
    }

    it('gets neighbours', () => {
        const risk = parseMap(sampleData);
        expect(risk.neighbours(3, 0)).toEqual([9, 9, 8, 7, 8]);
        expect(risk.neighbours(3, 1)).toEqual([8, 8, 9, 9, 9, 5, 6, 7]);
        expect(risk.neighbours(9, 4)).toEqual([7, 8, 9]);
        expect(risk.neighbours(0, 4)).toEqual([8, 8, 7]);
        expect(risk.neighbours(0, 0)).toEqual([1, 3, 9]);
    });

    it('gets risk from neighbours', () => {
        const risk = parseMap(sampleData);
        expect(risk.riskAt(1, 0)).toEqual(2);
        expect(risk.riskAt(9, 0)).toEqual(1);
        expect(risk.riskAt(9, 4)).toEqual(0);
        expect(risk.riskAt(0, 4)).toEqual(0);
        expect(risk.riskAt(0, 0)).toEqual(0);
    });

    it('finds low points', () => {
        expect(parseMap(sampleData).lows().lows).toEqual([1, 9, 22, 46])
    });

    it('crawls a basin', () => {
        expect(parseMap(sampleData).basin(1, 0)).toEqual({x: 1, y: 0, size: 3});
        expect(parseMap(sampleData).basin(9, 0)).toEqual({x: 9, y: 0, size: 9});
        expect(parseMap(sampleData).basin(2, 3)).toEqual({x: 2, y: 3, size: 14});
    });

    describe('questions', () => {
        it('prepares for question one', () => {
            expect(parseMap(sampleData).risk()).toBe(15);
        });

        it('prepares for question two', () => {
            expect(parseMap(sampleData).lows().biggest).toEqual(1134);
        })

        it('gets one gold star', () => {
            expect(parseMap(inputData).risk()).toBe(475);
        });

        it('gets second gold star', () => {
            expect(parseMap(inputData).lows().biggest).toBe(1092012);
        });
    })


})