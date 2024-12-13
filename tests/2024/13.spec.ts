import {readInputFrom, sumOf, toLines} from '../__fixtures__';
import {minBy} from 'lodash';

describe('13', () => {
    const EXAMPLE = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
    `;
    const OFFSET: Point = {x: 10000000000000, y: 10000000000000};

    type Point = { x: number, y: number };
    type Win = void | { a: number; b: number; cost: number };
    type Game = {
        buttonB: Point;
        buttonA: Point;
        prize: Point;
        win: Win;
    };

    /*
        Quadratic equation... solve for a & b where AX/AY, BX/BY and PX/PY are known constants

        a * AX + b * BX = PX
        a * AY + b * BY = PY
     */
    function quadratic(buttonA: Point, buttonB: Point, prize: Point): Win {
        let a1 = buttonA.x, b1 = buttonB.x, c1 = prize.x;
        let a2 = buttonA.y, b2 = buttonB.y, c2 = prize.y;

        let determinant = a1 * b2 - a2 * b1;
        if (!determinant) return;

        const determinantA = c1 * b2 - c2 * b1;
        const determinantB = a1 * c2 - a2 * c1;

        const a = determinantA / determinant;
        const b = determinantB / determinant;

        if (Math.trunc(a) !== a || Math.trunc(b) !== b) {
            return;
        }

        return { a, b, cost: (3 * a) + b };
    }

    function walk(buttonA: Point, buttonB: Point, prize: Point): Win {
        const wins: Array<{ a: number, b: number, cost: number }> = [];
        for (let a = 0; (a * buttonA.x) <= prize.x; a++) {
            let b = (prize.x - a * buttonA.x) / buttonB.x;
            if (b !== Math.trunc(b)) {
                continue;
            }

            expect((buttonA.x * a) + (buttonB.x * b)).toBe(prize.x);
            if ((buttonA.y * a) + (buttonB.y * b) === prize.y) {
                wins.push({
                    a, b, cost: (a * 3) + b,
                });
            }
        }

        return minBy(wins, 'cost');
    }

    function game(buttonA: Point, buttonB: Point, prize: Point, gen: typeof walk): Game {
        return {
            buttonA,
            buttonB,
            prize,
            win: gen(buttonA, buttonB, prize),
        };
    }

    function parse(input: string, offset: Point = {x: 0, y: 0}, gen = walk) {
        const games: Game[] = [];
        for (let lines = toLines(input), i = 0, max = lines.length; i < max; i++) {
            games.push(
                game(toPoint(lines[i++]), toPoint(lines[i++]), addPoint(toPoint(lines[i++]), offset), gen)
            );
        }

        return {
            games,
            get cost() {
                return sumOf(
                    games.map(game => game.win?.cost || 0)
                );
            }
        }
    }

    function toPoint(input: string) {
        const [x, y] = Array.from(/X.(\d+), Y.(\d+)/.exec(input) || []).slice(1).map(Number);

        return {
            x, y
        };
    }

    function addPoint(a: Point, b: Point) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    }

    it('example.1', () => {
        expect(parse(EXAMPLE, undefined, walk).cost).toBe(480);
    });
    it('example.2', () => {
        expect(parse(EXAMPLE, undefined, quadratic).cost).toBe(480);
    });
    it('question.1', () => {
        expect(parse(readInputFrom(2024, 13)).cost).toBe(33481);
    });
    it('question.2', () => {
        expect(parse(readInputFrom(2024, 13), OFFSET, quadratic).cost).toBe(92572057880885);
    });

})