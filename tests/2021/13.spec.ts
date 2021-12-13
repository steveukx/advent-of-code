import { readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 13', () => {

    const sampleData = readInputFrom(2021, 13, 'sample');
    const inputData = readInputFrom(2021, 13, 'input');

    class Row {
        protected dots = new Set<number>();

        mark(x: number) {
            this.dots.add(x);
            return this;
        }

        markedAt(x: number) {
            return this.dots.has(x);
        }

        merge(other: Row) {
            this.dots = new Set([...this.dots, ...other.dots]);
            return this;
        }

        count () {
            return this.dots.size;
        }

        print (width: number) {
            let out: Array<string> = [];
            for (let i = 0; i < width; i++) {
                out.unshift(this.dots.has(i) ? '#' : ' ');
            }

            return out.join('');
        }

        splitAt(offset: number) {
            const dots = new Set<number>();
            for (const dot of this.dots) {
                // on right of the fold
                if (dot > offset) {
                    dots.add(dot - offset - 1);
                }
                // on left of the fold
                else if (dot < offset) {
                    dots.add(offset - dot - 1);
                }
            }

            this.dots = dots;
            return this;
        }
    }

    function parseInput(input: string) {
        const board: Row[] = [];
        const folds: Array<{ axis: 'x' | 'y', offset: number }> = [];
        let width = 0;

        let buildingPhase = true;
        input.split('\n').forEach((line) => {
            if (!line) {
                return buildingPhase = false;
            }

            if (buildingPhase) {
                const [x, y] = line.split(',').map(Number);
                while (y >= board.length) {
                    board.push(new Row());
                }

                width = x > width ? x : width;

                return board[y].mark(x);
            }

            const [, axis, offset] = /\s([xy])=(\d+)$/.exec(line) || [];
            if (!axis || !offset) throw new Error(`unknown fold definition: ${line}`);

            return folds.push({axis: axis as 'x' | 'y', offset: Number(offset)});
        });

        return {board, folds, width: width + 1, height: board.length};
    }

    function applyFold(board: Row[], axis: 'x' | 'y', offset: number) {
        if (axis === 'y') {
            return foldUp(board, offset);
        }

        return foldLeft(board, offset);
    }

    function foldUp(board: Row[], offset: number) {
        const below = [...board];
        const above = below.splice(0, offset + 1);
        above.pop();

        const insertAt = above.length - 1;
        for (let i = 0; i < below.length; i++) {
            above[insertAt - i].merge(below[i]);
        }

        return above;
    }

    function foldLeft(board: Row[], offset: number) {
        return board.map(row => row.splitAt(offset));
    }

    function dotCount(input: string, maxFolds = Infinity) {
        let {board, folds} = parseInput(input);
        for (let i = 0; i < folds.length && i < maxFolds; i++) {
            board = applyFold(board, folds[i].axis, folds[i].offset);
        }

        return board.reduce((count, row) => count + row.count(), 0);
    }

    function printer(input: string) {
        let {board, folds, width} = parseInput(input);
        for (let i = 0; i < folds.length; i++) {
            board = applyFold(board, folds[i].axis, folds[i].offset);
        }

        return board.map(row => row.print(width)).join('\n');
    }

    it('parses', () => {
        const {board, folds, width, height} = parseInput(sampleData);

        expect(folds).toEqual([{axis: 'y', offset: 7}, {axis: 'x', offset: 5}]);
        expect(board[0].markedAt(3)).toBe(true);
        expect(width).toBe(11);
        expect(height).toBe(15);
    });

    it('folds', () => {
        const {board, folds} = parseInput(sampleData);
        const foldedY = applyFold(board, folds[0].axis, folds[0].offset)!;

        expect(foldedY).toHaveLength(7);
        expect(foldedY[0].count()).toBe(5);
        expect(foldedY[0].markedAt(0)).toBe(true);

        const foldedX = applyFold(foldedY, folds[1].axis, folds[1].offset)!;

        expect(foldedX).toHaveLength(7);
        expect(foldedX[0].count()).toBe(5);
    });

    it('prepares for question one', () => {
        expect(dotCount(sampleData, 1)).toBe(17);
        expect(dotCount(sampleData, 2)).toBe(16);
    });

    it('tries question one', () => {
        expect(dotCount(inputData, 1)).toBe(765);
    });

    it('prepares for question two', () => {
        console.log(printer(sampleData));
    })

    it('tries question two', () => {
        console.log(printer(inputData));
    })

    it('folds left', () => {
        const row = new Row();
        row.mark(1).mark(3).mark(6).mark(8).mark(9).mark(10);
        expect(row.count()).toBe(6);

        row.splitAt(5);
        expect(row.count()).toBe(5);
    });
})