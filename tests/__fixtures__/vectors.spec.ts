import { mergeVectors, pointVector } from './vectors';

describe('vectors', () => {

    it.each([
        [123, 456, 123, 456, true],
        [123, 456, 123, 234, true],
        [123, 456, 456, 789, true],
        [123, 456, 12, 34, false],
        [123, 456, 1234, 4567, false],
    ])('detects overlaps (%s, %s):(%s, %s)', (l1, u1, l2, u2, expected) => {
        expect(
            pointVector(l1, u1).overlaps(pointVector(l2, u2))
        ).toBe(expected);
    })

    it('gets the size', () => {
        expect(pointVector(1, 3).size()).toBe(2);
        expect(pointVector(1, 3).size(true)).toBe(3);
    })

    it('merges vectors', () => {
        const vectors = [
            pointVector(10, 20),
            pointVector(45, 50),
            pointVector(10, 15),
            pointVector(15, 30),
        ];

        expect(mergeVectors(vectors)).toEqual([
            pointVector(10, 30),
            pointVector(45, 50),
        ]);
    });
});