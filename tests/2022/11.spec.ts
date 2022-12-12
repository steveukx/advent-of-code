import { DESC, productOf, readInputFrom, toStringArray } from '../__fixtures__';

describe('11', function () {
    class Monkey {
        public readonly items: number[] = [];
        public denominator = 1;
        public onTrue = this.id;
        public onFalse = this.id;
        public inspected = 0;

        constructor(
            private readonly game: Monkey[],
            private readonly relief: (is: number, monkey: Monkey) => number,
            public readonly id: number,
        ) {
        }

        go() {
            const items = this.items.splice(0, this.items.length);
            items.forEach(item => {
                this.inspected++;
                const next = this.relief(this.inspect(item), this);
                this.game[(next % this.denominator) ? this.onFalse : this.onTrue].addItem(next);
            });
        }

        addItem(item: number) {
            this.items.push(item);
        }

        inspect(old: number) {
            return old;
        }
    }

    function monkeys(input: string, relief = (is: number, _monkey: Monkey) => is) {
        let game: Monkey[] = [];
        let monkey: Monkey;
        let actions: Array<{ test: RegExp, handler(...strings: string[]): void }> = [
            {
                test: /Monkey (\d):/,
                handler(id) {
                    monkey = game[game.length] = new Monkey(game, relief, +id);
                }
            },
            {
                test: /Starting items: ([0-9, ]+)$/,
                handler(items) {
                    items.split(', ').forEach(item => {
                        monkey.addItem(+item);
                    });
                },
            },
            {
                test: /Test: divisible by (\d+)$/,
                handler(denominator) {
                    monkey.denominator = +denominator;
                },
            },
            {
                test: /If (true|false): throw to monkey (\d+)$/,
                handler(when, id) {
                    when === 'true' ? monkey.onTrue = +id : monkey.onFalse = +id;
                },
            },
            {
                test: /Operation: new = (.+)$/,
                handler(operation) {
                    monkey.inspect = new Function('old', `return ${operation}`) as (old: number) => number;
                },
            },
        ];

        toStringArray(input).forEach(line => {
            actions.some(({test, handler}) => {
                const match = test.exec(line);
                if (match) {
                    handler(...match.slice(1));
                }
                return !!match;
            });
        });

        return {
            game,
            rounds(count = 1) {
                while (--count >= 0) {
                    game.forEach(monkey => monkey.go());
                }
            },
            monkeyBusiness() {
                return productOf(
                    game.map(m => m.inspected).sort(DESC).slice(0, 2)
                );
            }
        }
    }

    it('ex1', () => {
        const {rounds, monkeyBusiness} = monkeys(
            readInputFrom(2022, 11, 'sample'),
            (was: number) => Math.floor(was / 3)
        );
        rounds(20);

        expect(monkeyBusiness()).toBe(10605);
    });

    it('q1', () => {
        const {rounds, monkeyBusiness} = monkeys(
            readInputFrom(2022, 11, 'input'),
            (was: number) => Math.floor(was / 3)
        );
        rounds(20);

        expect(monkeyBusiness()).toBe(55216);
    });

    it('ex2', () => {
        let mod = 0;
        const {rounds, monkeyBusiness, game} = monkeys(
            readInputFrom(2022, 11, 'input'),
            (was) => (was % (mod = mod || productOf(game.map(m => m.denominator))))
        );

        rounds(10000);
        expect(monkeyBusiness()).toBe(12848882750);
    });
});