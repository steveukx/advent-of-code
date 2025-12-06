import { productOf, readInputFrom, sumOf } from '../__fixtures__';
import { sumBy } from 'lodash';

describe('06', () => {

    const sample = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

    type Column = {
        numbers: number[];
        push(number: number): void;
        action(action: string): void;
        readonly result: number
    }

    function column(): Column {
        const numbers: number[] = [];
        let operation: (input: number[]) => number = sumOf;

        return {
            numbers,
            push(number: number) {
                numbers.push(number);
            },
            action(action: string) {
                operation = action === '+' ? sumOf : productOf;
            },
            get result  () {
                return operation(numbers);
            },
        };
    }

    function parseOne(input: string) {
        const columns: Column[] = [];

        function tokenNumber(token: string, col: number) {
            columns.at(col)?.push(Number(token));
        }

        function tokenAction(token: string, col: number) {
            columns.at(col)?.action(token);
        }

        const lines = input.trim().split('\n');

        lines.forEach((line, row, all) => {
            const tokens = line.trim().split(/\s+/);
            if (!row) {
                tokens.forEach(() => columns.push(column()));
            }
            tokens.forEach(row === all.length - 1 ? tokenAction : tokenNumber);
        });

        return sumBy(columns, 'result');
    }

    function parseTwo(input: string) {
        const lines = input.split('\n');
        const actions = lines.pop()!.split(/\s+/);

        expect(lines.slice(0).every(l => l.length === lines[0].length)).toBe(true);

        const columns: Column[] = [];
        const addColumn = () => {
            (columns[columns.length] = column()).action(actions.shift()!);
            return columns[columns.length - 1];
        }

        const pointerMax = lines[0].length;
        for (let pointer = 0; pointer < pointerMax; pointer++) {
            const col = columns.at(-1) || addColumn();

            let number = lines.map(line => line.charAt(pointer).trim()).join('');
            if (number) {
                col.push(Number(number));
            }
            else {
                addColumn();
            }
        }

        return sumBy(columns, 'result');
    }

    it('s1', () => {
        expect(parseOne(sample)).toEqual(4277556);
    });

    it('s2', () => {
        expect(parseTwo(sample)).toBe(3263827);
    });

    it('e1', () => {
        expect(parseOne(readInputFrom(2025, 6))).toEqual(4771265398012);
    });

    it('e2', () => {
        expect(parseTwo(readInputFrom(2025, 6))).toEqual(10695785245101);
    });

})