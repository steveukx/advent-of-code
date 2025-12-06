import { readInputFrom } from '../__fixtures__';
import { sumBy } from 'lodash';
import { mergeVectors, pointVector, VectorLowerUpper } from '../__fixtures__/vectors';

describe('05', () => {
    const sample = `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
    `;

    function parse(input: string) {
        const lines = input.trim().split('\n');
        const fresh: VectorLowerUpper[] = [];
        const ingredients: number[] = [];
        const freshIngredients: number[] = [];

        let ranges = true;
        lines.forEach((line) => {
            if (!line) {
                return void (ranges = false);
            }
            if (ranges) {
                const [lower, upper] = line.split('-').map(Number);
                fresh.push(pointVector(lower, upper));
            }

            const ingredient = Number(line);
            ingredients.push(ingredient);
            fresh.some(x => x.contains(ingredient)) && freshIngredients.push(ingredient);
        });

        return {
            fresh,
            ingredients,
            freshIngredients,
        };
    }

    function countValid({fresh}: ReturnType<typeof parse>) {
        const merged = mergeVectors(fresh);

        return sumBy(merged, v => v.size(true));
    }

    it('s1', () => {
        expect(parse(sample).freshIngredients.length).toEqual(3);
    });

    it('s2', () => {
        expect(countValid(parse(sample))).toEqual(14);
    });

    it('e1', () => {
        expect(parse(readInputFrom(2025, 5)).freshIngredients.length).toEqual(862);
    });

    it('e2', () => {
        expect(countValid(parse(readInputFrom(2025, 5)))).toEqual(357907198933892);
    });

})