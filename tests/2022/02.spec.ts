import { readInputFrom } from '../__fixtures__';

describe('02', function () {

    const P1 = {
        ROCK: 'A',
        PAPER: 'B',
        SCISSORS: 'C',
    };
    const P2 = {
        ROCK: 'X',
        PAPER: 'Y',
        SCISSORS: 'Z',
    };
    const WIN = 6;
    const DRAW = 3;

    const GAME: Map<string, number> = new Map();
    const PLAY: Map<string, string> = new Map();

    Object.values(P1).forEach((p1, i1) => {
        Object.values(P2).forEach((p2, i2) => {
            const key = `${p1}${p2}`;

            let score = 0;
            if (i2 === (i1 + 1) || p1 === 'C' && !i2) {
                score += WIN;
                PLAY.set(`${p1}Z`, key);
            } else if (i1 === i2) {
                score += DRAW;
                PLAY.set(`${p1}Y`, key);
            } else {
                PLAY.set(`${p1}X`, key);
            }
            score += (i2 + 1);

            GAME.set(key, score);
        });
    });

    function strategy(input: string) {
        return input.trim().split('\n').map(line => line.replace(/\s*/g, ''));
    }

    function score(input: string[]) {
        return input.reduce((sum, x) => GAME.get(x)! + sum, 0)
    }

    it('eg1', () => {
        const input: string[] = strategy(`
        A Y
        B X
        C Z
        `);

        expect(score(input)).toBe(15);
    });

    it('q1', () => {
        expect(score(strategy(readInputFrom(2022, 2, 'sample')))).toBe(13005);
    });

    it('eg2', () => {
        const input: string[] = strategy(`
        A Y
        B X
        C Z
        `);

        const game = input.map(round => PLAY.get(round)!);
        expect(score(game)).toBe(12);
    });


    it('q2', () => {
        expect(score(strategy(readInputFrom(2022, 2, 'sample')).map(round => PLAY.get(round)!))).toBe(11373);
    });
});