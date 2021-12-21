describe('Year 2021: Day 21', () => {

    type TDie = {
        readonly rolls: number;
        roll(times?: number): number;
    }

    type TPlayer = {
        play(die: TDie): void;
        readonly score: number;
        readonly winner: boolean
    }

    const sampleData = {
        a: 4,
        b: 8,
    };

    const inputData = {
        a: 2,
        b: 10,
    }

    function deterministicDie(): TDie {
        let count = 0;
        let value = 100;

        function roll() {
            count += 1;
            return (value = value < 100 ? value + 1 : 1);
        }

        return {
            get rolls() {
                return count;
            },
            roll(times = 1) {
                if (times < 1) {
                    throw new Error(`Rolling a die must roll at least one time`);
                }

                let value = 0;
                for (let i = 0; i < times; i++) {
                    value += roll();
                }

                return value;
            }
        }
    }

    function player(position: number): TPlayer {
        // let rolls = 0;
        let score = 0;

        function advance(places: number) {
            const next = position + (places % 10);

            position = (next > 10) ? next - 10 : next;
            score += position;
        }

        return {
            get winner() {
                return score >= 1000;
            },
            get score() {
                return score; // * rolls;
            },
            play(die: TDie) {
                advance(die.roll(3));
                // rolls = die.rolls;
            }
        };
    }

    function game(die: TDie, players: [TPlayer, TPlayer], plays = -1) {
        do {
            const [active, inactive] = players;

            active.play(die);

            if (active.winner) {
                return {die, players, loser: inactive};
            }

            flip();
        }
        while (plays--);

        function flip() {
            players.push(players.shift()!);
        }

        return {
            die,
            players,
        }
    }

    it('plays each side', () => {
        const {die, loser} = game(deterministicDie(), [player(sampleData.a), player(sampleData.b)]);

        expect(loser!.score * die.rolls).toBe(739785);
    });

    it('tries question one', () => {
        const {die, loser} = game(deterministicDie(), [player(inputData.a), player(inputData.b)]);

        expect(loser!.score * die.rolls).toBe(571032);
    });
})