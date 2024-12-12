import { appendItem, Cell, neighbours, readInputFrom, removeItem, sumOf, toTabular } from '../__fixtures__';

describe('12', () => {
    const EXAMPLE = `
AAAA
BBCD
BBCC
EEEC`;

    class Plot extends Cell<string> {
        public region: Region | undefined;
    }

    class Region {
        public readonly plots = new Set<Plot>();

        constructor(private grid: Plot[][], public readonly type: string, plot?: Plot) {
            plot && this.plots.add(plot);
        }

        transfer(onto: Region) {
            this.plots.forEach(plot => {
                onto.plots.add(plot);
                plot.region = onto;
            });
            this.plots.clear();
            return onto;
        }

        get bulkPrice() {
            return this.area * this.corners;
        }

        get price() {
            return this.area * this.perimeter();
        }

        get area() {
            return this.plots.size;
        }

        get corners() {
            const get = (y: number, x: number, data: string) => {
                return !this.grid[y]?.[x] || !this.plots.has(this.grid[y][x]);
            }
            let count = 0;
            for (const plot of this.plots) {
                const n = get(plot.y - 1, plot.x, plot.data);
                const s = get(plot.y + 1, plot.x, plot.data);
                const w = get(plot.y, plot.x - 1, plot.data);
                const e = get(plot.y, plot.x + 1, plot.data);

                const innerCorners = ((n && w) ? 1 : 0) + ((n && e) ? 1 : 0) + ((s && w) ? 1 : 0) + ((s && e) ? 1 : 0);
                let outerCorners = 0;

                if (n && !w && this.plots.has(this.grid[plot.y - 1]?.[plot.x - 1]!)) {
                    outerCorners += 1;
                }
                if (n && !e && this.plots.has(this.grid[plot.y - 1]?.[plot.x + 1]!)) {
                    outerCorners += 1;
                }
                if (s && !w && this.plots.has(this.grid[plot.y + 1]?.[plot.x - 1]!)) {
                    outerCorners += 1;
                }
                if (s && !e && this.plots.has(this.grid[plot.y + 1]?.[plot.x + 1]!)) {
                    outerCorners += 1;
                }

                count += innerCorners + outerCorners;
            }

            return count;
        }

        perimeter() {
            return sumOf(
                Array.from(this.plots, plot => {
                    const others = neighbours(plot.x, plot.y, this.grid, false);
                    return (4 - others.length) + others.filter(other => other.data !== plot.data).length;
                })
            );
        }
    }

    function generateRegions(cells: Plot[], grid: Plot[][]) {
        const regions: Region[] = [];

        cells.forEach(cell => {
            let region: Region = new Region(grid, cell.data, cell);

            for (const other of neighbours(cell.x, cell.y, grid, false)) {
                if (other.data !== cell.data) {
                    continue;
                }

                if (region && other.region && region !== other.region) {
                    region = removeItem(regions, region).transfer(other.region);
                }

                region = other.region || region;
            }

            cell.region = appendItem(regions, region || new Region(grid, cell.data), true);
        });

        return regions;
    }

    function parse(input: string) {
        const cells: Plot[] = [];
        const {grid} = toTabular(input.trim(), (from, x, y) =>
            appendItem(cells, new Plot(x, y, from))
        );

        const regions = generateRegions(cells, grid);

        const price = sumOf(regions.map(region => region.price));
        const bulkPrice = sumOf(regions.map(region => region.bulkPrice));

        return {
            cells,
            grid,
            regions,
            price,
            bulkPrice,
        };

    }

    it('example.1', () => {
        expect(parse(EXAMPLE).price).toBe(140);
    });
    it('example.2', () => {
        expect(parse(EXAMPLE).bulkPrice).toBe(80);
    });
    it('question.1', () => {
        expect(parse(readInputFrom(2024, 12)).price).toBe(1352976)
    });
    it('question.2', () => {
        expect(parse(readInputFrom(2024, 12)).bulkPrice).toBe(808796)
    });
})