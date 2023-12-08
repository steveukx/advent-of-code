import lcm from 'compute-lcm';
import { readInputFrom, toLines } from '../__fixtures__';

describe('08', function () {
    const INPUT = readInputFrom(2023, 8, 'input');
    const EXAMPLE = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
    const EXAMPLE_2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

    abstract class AbstractNetwork {
        public count = 0;
        public get complete () {
            return false;
        }

        abstract next (): boolean;

        protected nextStep () {
            const step = this.steps.shift()!
            this.steps.push(step);
            this.count++;

            return step === 'L' ? 0 : 1;
        }

        protected init () {}

        protected navigate(current: string, next: 0 | 1) {
            return this.nodes.get(current)![next];
        }

        size () {
            return this.count;
        }

        constructor(protected readonly steps: string[], protected readonly nodes: Map<string, [string, string]>) {
            this.init();
        }
    }

    class NetworkA extends AbstractNetwork {
        private current = 'AAA';

        public get complete () {
            return this.current === 'ZZZ';
        }

        public next () {
            if (!this.complete) {
                this.current = this.navigate(this.current, this.nextStep());
            }

            return this.complete;
        }
    }

    class NetworkB extends AbstractNetwork {
        private current!: Map<string, { node: string, complete: boolean, count: number }>;

        public get complete () {
            for (const {complete} of this.current.values()) {
                if (!complete) return false;
            }
            return true;
        }

        protected init() {
            this.current = new Map(Array.from(this.nodes.keys()).filter(key => key.match(/[AZ]$/)).map(key => {
                return [key, {
                    node: key,
                    complete: false,
                    count: 0,
                }];
            }));
        }

        next () {
            if (this.complete) return true;

            const next = this.nextStep();
            for (const [key, data] of this.current.entries()) {
                if (data.complete) continue;

                const node = this.navigate(data.node, next);
                this.current.set(key, {
                    complete: node.endsWith('Z'),
                    count: data.count + 1,
                    node,
                });
            }

            return this.complete;
        }

        size () {
            const lowest = lcm(
                Array.from(this.current.values(), (x) => x.count)
            );

            return lowest || 0;
        }
    }

    function createNetworkA (...args: ConstructorParameters<typeof AbstractNetwork>): AbstractNetwork {
        return new NetworkA(...args);
    }

    function createNetworkB (...args: ConstructorParameters<typeof AbstractNetwork>): AbstractNetwork {
        return new NetworkB(...args);
    }

    function parse(input: string, createNetwork = createNetworkA) {
        const lines = toLines(input);
        const steps = lines.shift()!.split('');
        const nodes = new Map<string, [string, string]>();

        for (const line of lines) {
            if (!line) continue;
            const split = line.split(/[^A-Z0-9]+/);
            nodes.set(split.shift()!, split.slice(0, 2) as [string, string]);
        }

        const network = createNetwork(steps, nodes);

        let escape = 0;
        while (!network.complete) {
            network.next();
            if (escape++ > 5000000000) {
                throw new Error(`escape hatch`);
            }
        }

        return { network }
    }

    it('ex1', () => {
        expect(parse(EXAMPLE).network.size()).toBe(2);
    })

    it('ex2', () => {
        expect(parse(EXAMPLE_2, createNetworkB).network.size()).toBe(6);
    })

    it('q1', () => {
        console.log(parse(INPUT).network.count);
    });

    it('q2', () => {
        console.log(parse(INPUT, createNetworkB).network.size());
    });
});