import { readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 12', () => {
    const miniData = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
    const miniResult = `start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end`.split('\n').sort();
    const sampleData = readInputFrom(2021, 12, 'sample');
    const inputData = readInputFrom(2021, 12, 'input');

    enum Size { LARGE, SMALL, TERMINUS }

    class Cave {
        public readonly links: Cave[] = [];

        constructor(public readonly size: Size, public readonly key: string) {
        }

        skipTo(end: Cave, skip?: Cave, {
            visits,
            from
        }: { visits: Map<Cave, number>, from: Cave[] } = {
            visits: new Map(),
            from: []
        }, routes: Set<string> = new Set()) {
            const visitsToNow = new Map(visits).set(this, (visits.get(this) || 0) + 1);
            const path = [...from, this];

            if (end === this) {
                routes.add(path.join(','));
            } else {
                this.links.forEach(link => {
                    if (link.size === Size.LARGE || !visits.has(link)) {
                        link.skipTo(end, skip, { visits: visitsToNow, from: path }, routes);
                    }
                    else if (link === skip && visits.get(link)! < 2) {
                        link.skipTo(end, skip, { visits: visitsToNow, from: path }, routes);
                    }
                })
            }

            return routes;
        }

        walkTo(end: Cave, from: Cave[] = [], routes: Set<string> = new Set()) {
            const path = [...from, this];

            if (end === this) {
                routes.add(path.join(','));
            } else {
                this.links.forEach(link => {
                    if (link.size === Size.LARGE || !from.includes(link)) {
                        link.walkTo(end, path, routes);
                    }
                })
            }

            return routes;
        }

        link(other: Cave) {
            if (!this.links.includes(other)) {
                this.links.push(other);
            }
            if (!other.links.includes(this)) {
                other.links.push(this);
            }
        }

        toString() {
            return this.key;
        }
    }

    function parseInput(input: string) {
        const caves: Map<string, Cave> = new Map();
        input.split('\n').forEach(line => {
            const [, start, end] = /^([a-z]+)-([a-z]+)$/i.exec(line) || [];
            if (!start || !end) throw new Error(`Unable to parse ${line}`);

            getCave(start).link(getCave(end));
        });

        return {
            caves,
            start: caves.get('start')!,
            end: caves.get('end')!,
            small: Array.from(caves.values()).filter(cave => cave.size === Size.SMALL),
        };

        function getCave(key: string) {
            return caves.set(key, caves.get(key) || createCave(key)).get(key)!;
        }

        function createCave(key: string) {
            switch (key) {
                case 'start':
                case 'end':
                    return new Cave(Size.TERMINUS, key);
                case key.toUpperCase():
                    return new Cave(Size.LARGE, key);
                default:
                    return new Cave(Size.SMALL, key);
            }
        }
    }

    it('prepares for question two - mini sample', () => {
        const {small, start, end} = parseInput(miniData);
        const paths = small.reduce((all, cave) => {
            return start.skipTo(end, cave, undefined, all);
        }, new Set<string>());

        expect([ ...paths ].sort()).toEqual(`start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end`.split('\n').sort());
    });

    it('prepares for question two', () => {
        const {small, start, end} = parseInput(sampleData);
        const paths = small.reduce((all, cave) => {
           return start.skipTo(end, cave, undefined, all);
        }, new Set<string>());

        expect(paths.size).toBe(3509);
    });

    it('tries question two', () => {
        const {small, start, end} = parseInput(inputData);
        const paths = small.reduce((all, cave) =>
            start.skipTo(end, cave, undefined, all), new Set<string>());

        expect(paths.size).toBe(149385);
    });

    it('prepares for question one - sample', () => {
        const {start, end} = parseInput(miniData);
        const paths = [...start.walkTo(end)].sort();

        expect(paths).toEqual(miniResult)
    });

    it('prepares for question one - large sample', () => {
        const {start, end} = parseInput(`dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`);
        const paths = [...start.walkTo(end)].sort();
        expect(paths).toEqual(`start,HN,dc,HN,end
start,HN,dc,HN,kj,HN,end
start,HN,dc,end
start,HN,dc,kj,HN,end
start,HN,end
start,HN,kj,HN,dc,HN,end
start,HN,kj,HN,dc,end
start,HN,kj,HN,end
start,HN,kj,dc,HN,end
start,HN,kj,dc,end
start,dc,HN,end
start,dc,HN,kj,HN,end
start,dc,end
start,dc,kj,HN,end
start,kj,HN,dc,HN,end
start,kj,HN,dc,end
start,kj,HN,end
start,kj,dc,HN,end
start,kj,dc,end`.split('\n').sort())
    });

    it('prepares for question one - largest sample', () => {
        const {start, end} = parseInput(`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`);
        const paths = start.walkTo(end);

        expect(paths.size).toBe(226);
    });

    it('tries question one', () => {
        const {start, end} = parseInput(`VJ-nx
start-sv
nx-UL
FN-nx
FN-zl
end-VJ
sv-hi
em-VJ
start-hi
sv-em
end-zl
zl-em
hi-VJ
FN-em
start-VJ
jx-FN
zl-sv
FN-sv
FN-hi
nx-end`);
        const paths = start.walkTo(end);
        expect(paths.size).toBe(5254);
    });


})