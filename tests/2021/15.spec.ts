import { anArray, neighbours, readInputFrom, toGrid } from '../__fixtures__';
import { fromGrid } from '../__fixtures__/toGrid';

describe('Year 2021: Day 15', () => {

    const inputData = readInputFrom(2021, 15, 'input');
    const sampleData = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

    class Route {
        constructor(public cells: Set<Cell>, public head: Cell, public risk: number) {
        }

        walkTo(end: Cell, active: Set<Route>, complete: Set<Route>, winner?: Route) {
            active.delete(this);

            if (this.head === end) {
                this.cells.clear();
                complete.add(this);
                return;
            }

            if (winner && winner.risk <= this.risk) {
                console.log(`Route.walkTo: current=${this.risk} exceeds winning=${winner.risk}`);
                return;
            }

            for (const neighbour of this.head.neighbours) {
                if (this.cells.has(neighbour)) {
                    continue;
                }

                if (neighbour.route && neighbour.route.risk < (this.risk + neighbour.value)) {
                    continue;
                }

                neighbour.route && active.delete(neighbour.route);
                active.add(
                    neighbour.route = new Route(new Set([...this.cells, neighbour]), neighbour, this.risk + neighbour.value)
                );
            }
        }
    }

    class Cell {
        neighbours = new Set<Cell>();
        route?: Route;
        rank = 0;

        readonly id: string;

        constructor(public readonly value: number, public readonly x: number, public readonly y: number) {
            this.id = `${x}:${y}`;
        }

        toRoutes() {
            return Array.from(
                this.neighbours,
                (neighbour) => neighbour.route = new Route(new Set([this, neighbour]), neighbour, neighbour.value)
            );
        }

        toString() {
            return String(this.value);
        }
    }

    function rank(x: number, y: number) {
        const h = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        const x45 = (x + y) / 2
        const h45 = Math.sqrt(x45 * x45 + x45 * x45);

        return Math.abs(h45 / h) || 1;
        // if (!h) return h;
        //
        // const theta = Math.asin(y / h);
        // const gamma = 45 - (90 - theta);
        // const delta = Math.sin(gamma) * h;
        //
        // return Math.abs(delta);
    }

    function toCells(grid: Cell[][]) {
        // const midY = grid.length / 2;
        // const midX = (grid[0]?.length || 0) / 2;

        const cells = grid.flatMap((row, y) => {
            return row.map((cell, x) => {
                cell.neighbours = new Set(neighbours(x, y, grid, false));
                cell.rank = rank(x, y);
                return cell;
            });
        });

        const start = cells[0];
        const end = cells[cells.length - 1];

        return {start, end, cells, height: grid.length, width: grid[0]?.length || 0};
    }

    function calculateRisk(grid: Cell[][]) {
        const {start, end} = toCells(grid);

        let complete = new Set<Route>();
        let active = new Set<Route>(start.toRoutes());

        let winner: Route | undefined;
        do {
            const next = new Set([...active]);
            let slice = 0;
            for (const route of active) {
                next.has(route) && route.walkTo(end, next, complete, winner);
                if (slice++ > 50) {
                    break;
                }
            }

            active = new Set([...next].sort((a, b) => {
                return b.head.rank - a.head.rank;
            }));

            if (complete.size > 1) {
                complete.forEach(route => {
                    if (!winner || winner.risk > route.risk) {
                        console.log(`calculateRisk: winner=${route.risk}`);
                        winner = route;
                    }
                });

                complete = new Set();
            }
        } while (active.size > 0);

        if (!winner) {
            throw new Error('Did not find a complete route');
        }

        return winner.risk;
    }

    function parseInput(input: string) {
        return toGrid(input, (value, x, y) => new Cell(+value, x, y));
    }

    function parseExpandedInput(input: string) {
        const grid = toGrid(input, (value, x, y) => new Cell(+value, x, y));
        const expanded = anArray<Cell[]>(grid.length * 5, () => []);

        function expandRows() {
            for (let y = 0, yMax = grid.length; y < yMax; y++) {
                const row = grid[y];
                for (let yy = 0; yy < 5; yy++) {
                    expanded[y + (yy * yMax)] = row.map(cell => {
                        const next = (cell.value + yy) > 9 ? cell.value + yy - 9 : cell.value + yy;
                        return new Cell(next, cell.x, y + (yy * yMax))
                    });
                }
            }
        }

        function expandEachRow() {
            for (let y = 0, yMax = expanded.length; y < yMax; y++) {
                const row = [...expanded[y]];
                const xMax = row.length;
                for (let xx = 1; xx < 5; xx++) {
                    expanded[y].push(
                        ...row.map((cell, x) => {
                            const next = (cell.value + xx) > 9 ? cell.value + xx - 9 : cell.value + xx;
                            return new Cell(next, x + (xx * xMax), cell.y);
                        })
                    );
                }
            }
        }

        expandRows();
        expandEachRow();

        return expanded;
    }

    it('plop', () => {
        const actual = calculateRisk(parseInput(sampleData));
        expect(actual).toBe(40);
    });

    it('tries question one', () => {
        const actual = calculateRisk(parseInput(inputData));
        expect(actual).toBe(390);
    });

    it('expands a grid', () => {
        const expanded = parseExpandedInput(sampleData);
        expect(fromGrid(expanded)).toEqual(`11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479`)
    });

    it('plop two', () => {
        const grid = parseExpandedInput(inputData);
        const actual = calculateRisk(grid);
        expect(actual).toBe(390);
    });

});