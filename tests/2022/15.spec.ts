import { Range, readInputFrom, toStringArray, withinRange } from '../__fixtures__';

describe('15', function () {

    const sampleData = `
        Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3
    `;
    const inputData = readInputFrom(2022, 15, 'input');

    class Point {
        constructor(public readonly x: number, public readonly y: number) {
        }

        toString() {
            return `${this.x}:${this.y}`;
        }
    }

    class Beacon extends Point {
    }

    class Sensor extends Point {
        public readonly offset: number;

        constructor(x: number, y: number, public readonly beacon: Beacon) {
            super(x, y);
            this.offset = Math.abs(x - beacon.x) + Math.abs(y - beacon.y);
        }
    }

    function parse(input: string) {
        const beacons = new Map<string, Beacon>();
        const sensors = new Set<Sensor>();

        toStringArray(input).forEach(line => {
            const [sX, sY, bX, bY] = Array.from(
                line.matchAll(/-?\d+/g) as unknown as string[],
                parseFloat
            );
            sensors.add(
                new Sensor(sX, sY, getBeacon(bX, bY)),
            );
        });

        return {
            beacons,
            sensors,
            row,
            gaps,
        };

        function row(y: number, withBeacons = false) {
            const coveredX = new Set<number>();

            beacons.forEach(beacon => beacon.y === y && coveredX.add(beacon.x));
            sensors.forEach(sensor => {
                const xOffset = sensor.offset - Math.abs(sensor.y - y);
                if (xOffset <= 0) return;

                for (let x = sensor.x - xOffset, max = sensor.x + xOffset; x <= max; x++) {
                    coveredX.add(x);
                }
            });
            !withBeacons && beacons.forEach(beacon => beacon.y === y && coveredX.delete(beacon.x));

            return coveredX;
        }

        function gaps(map: Set<number>, xMin = 0, xMax = 4000000) {
            for (const x of map) {
                if (withinRange(xMin, xMax, x) === Range.WITHIN) {
                    if (!map.has(x - 1)) {
                        return x - 1;
                    }
                    if (!map.has(x + 1)) {
                        return x + 1;
                    }
                }
            }

            return null
        }

        function getBeacon(x: number, y: number) {
            const key = String(new Point(x, y));
            let beacon = beacons.get(key);
            if (!beacon) {
                beacons.set(key, beacon = new Beacon(x, y));
            }
            return beacon;
        }
    }

    it('ex1', () => {
        const p = parse(sampleData);
        expect(p.row(10).size).toBe(26);
    });

    it('q1', () => {
        const p = parse(inputData);
        expect(p.row(2000000).size).toBe(4873353);
    });

    it('ex2', () => {
        let point: Point | undefined;
        const p = parse(sampleData);
        const max = 20;
        const origin = max / 2;
        for (let offset = 1, x: number | null = null; offset <= origin; offset++) {
            x = p.gaps(p.row(origin - offset, true), 0, max);
            if (x !== null) {
                point = new Point(x, origin - offset);
                break;
            }

            x = p.gaps(p.row(origin + offset, true), 0, max);
            if (x !== null) {
                point = (new Point(x, origin + offset));
                break;
            }
        }

        if (!point) throw new Error(`Point not found`);

        expect((point.x * 4000000) + point.y).toBe(56000011);
    });
    it('q2', () => {
        let point: Point | undefined;
        const p = parse(sampleData);
        const max = 4000000;
        const origin = max / 2;
        for (let offset = 1, x: number | null = null; offset <= origin; offset++) {
            x = p.gaps(p.row(origin + offset, true), 0, max);
            if (x !== null) {
                point = (new Point(x, origin + offset));
                break;
            }

            x = p.gaps(p.row(origin - offset, true), 0, max);
            if (x !== null) {
                point = new Point(x, origin - offset);
                break;
            }
        }

        if (!point) throw new Error(`Point not found`);

        expect((point.x * 4000000) + point.y).toBe(60000025);
    });
});