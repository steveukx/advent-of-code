import { EventEmitter } from 'events';
import { anArray, readInputFrom } from './__fixtures__';

describe('Year 2021: Day 4', () => {

    class Num extends EventEmitter {
        private used = false;

        constructor(private value: string) {
            super();
            this.setMaxListeners(1000);
        }

        public use() {
            if (!this.used) {
                this.used = true;
                this.emit('use', this);
            }
            return this;
        }

        scoreValue() {
            return this.used ? 0 : this.rawValue();
        }

        rawValue() {
            return parseInt(this.value, 10);
        }

        toString() {
            return this.used ? '' : String(this.value);
        }
    }

    class Numbers {
        private cache: Record<string, Num> = {};

        public get(key: string) {
            return this.cache[key] = this.cache[key] || new Num(key);
        }

        public use(key: string) {
            this.get(key).use();
        }
    }

    class Board extends EventEmitter {
        private result?: { sum: number, called: number, value: number };
        private allocated: Num[] = [];
        private readonly columns: Num[][];
        private readonly rows: Num[][];

        constructor(private width = 5, private height = 5) {
            super();
            this.columns = anArray(this.width, () => []);
            this.rows = anArray(this.height, () => []);
        }

        public get building() {
            return this.allocated.length < (this.height * this.width);
        }

        public get value() {
            return this.result?.value || -1;
        }

        validate(called: Num, column: Num[], row: Num[]) {
            if (column.join('') && row.join('') || this.result) {
                return;
            }

            const sum = this.allocated.reduce((sum, num) => {
                return sum + num.scoreValue();
            }, 0);

            this.result = {sum, called: called.rawValue(), value: sum * called.rawValue()};
            this.emit('win', this);
        }

        allocate(num: Num) {
            if (!this.building) {
                throw new Error(`Allocated into a complete Board`);
            }

            const index = this.allocated.length;
            const column = this.columns[index % this.height];
            const row = this.rows[Math.floor(index / this.width)];

            column.push(num);
            row.push(num);
            this.allocated.push(num);

            num.on('use', () => this.validate(num, column, row));
        }
    }

    class Game {
        public readonly winning: Array<Board> = [];
        public playing = new Set<Board>();

        constructor(public readonly boards: Board[], private numbers: Numbers) {
            boards.forEach(board => {
                this.playing.add(board);
                board.on('win', this.onBoardComplete);
            });
        }

        private onBoardComplete = (board: Board) => {
            this.playing.delete(board);
            this.winning.push(board);
        };

        * play(sequence: string[]) {
            for (let i = 0, wins = this.winning.length; this.playing.size && i < sequence.length; i++) {
                this.numbers.use(sequence[i]);
                while (wins < this.winning.length) {
                    yield this.winning[wins++];
                }
            }
        }
    }

    function boardBuilder(numbers: Numbers, lines: string[]) {
        let board: Board;
        const boards = [board = new Board()];

        lines.forEach(line => {
            if (!line) return;

            if (!board.building) {
                boards.push(board = new Board());
            }

            line.trim().split(/\s+/).forEach(value => {
                board.allocate(numbers.get(value));
            });
        });

        return boards;
    }

    function parseInput(input: string) {
        const lines = input.trim().split('\n');
        const order = lines.shift()!.split(',');
        const numbers = new Numbers();
        const game = new Game(boardBuilder(numbers, lines), numbers);

        return {
            order,
            game,
        };
    }

    describe('sample', () => {
        const data = readInputFrom(2021, 4, 'sample');

        it('gets the sequence to call from the input', () => {
            expect(parseInput(data).order).toEqual([
                7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1
            ].map(String));
        })

        it('builds boards', () => {
            expect(parseInput(data).game.boards).toHaveLength(3);
        });

        it('recognises a winner when a row is complete', () => {
            const {game, order} = parseInput(data);
            const [winner, ...winners] = Array.from(
                game.play(order.slice(0, 12))
            );

            expect(winners).toHaveLength(0);
            expect(winner).toHaveProperty('value', 4512);

            expect(game.winning).toEqual([winner]);
            expect(game.playing.size).toEqual(2);
        });

        it('plays to completion', () => {
            const {game, order} = parseInput(data);
            const [first, second, third, ...winners] = Array.from(game.play(order));

            // no unexpected winners
            expect(winners).toHaveLength(0);

            // winners had the expected values
            expect(first).toHaveProperty('value', 4512);
            expect(second).not.toBeUndefined();
            expect(third).toHaveProperty('value', 1924);

            // correctly stored the order of winners
            expect(game.winning).toEqual([first, second, third]);
            expect(game.playing.size).toEqual(0);
        });
    });

    describe('questions', () => {
        let game: Game;

        it('it detects the first winner', () => {
            givenSampleData();
            expect(questionOne()).toBe(4512);
        });

        it('detects the final winner', () => {
            givenSampleData();
            expect(questionTwo()).toBe(1924);
        });

        it('gets first gold star', () => {
            givenInputData();
            expect(questionOne()).toBe(69579);
        });

        it('gets first gold star', () => {
            givenInputData();
            expect(questionTwo()).toBe(14877);
        });

        function questionOne() {
            return game.winning.shift()?.value;
        }

        function questionTwo() {
            return game.winning.pop()?.value;
        }

        function givenSampleData() {
            const env = parseInput(readInputFrom(2021, 4, 'sample'));
            Array.from((game = env.game).play(env.order));
        }

        function givenInputData() {
            const env = parseInput(readInputFrom(2021, 4, 'input'));
            Array.from((game = env.game).play(env.order));
        }

    });

})
