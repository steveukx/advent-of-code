export type Point = { x: number, y: number };

export const ZeroPoint: Point = Object.freeze({
    x: 0, y: 0
})

export function pointAdd(a: Point, b: Point) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

export function thePoint(x = 0, y = 0): Point {
    return Object.freeze({ x, y });
}

export function pointIs(point: Point, other: Point) {
    return point.x === other.x && point.y === other.y;
}

export function pointKey(point: Point) {
    return `${point.x}:${point.y}`;
}

export const COMPASS = Object.freeze({
    N: thePoint(0, -1),
    S: thePoint(0, 1),
    W: thePoint(-1, 0),
    E: thePoint(1, 0),
});