export * from './arrays';
export * from './assertions';
export * from './math';
export * from './neighbours';
export * from './parse';
export * from './points';
export * from './toGrid';

export function onlyIn<T>(input: T[]): T {
    expect(input).toHaveLength(1);
    return input[0];
}

export enum Range {
    BELOW,
    WITHIN,
    ABOVE,
}

export function withinRange(min: number, max: number, test: number): Range {
    if (min > max) return withinRange(max, min, test);

    if (test < min) {
        return Range.BELOW;
    }

    if (test > max) {
        return Range.ABOVE;
    }

    return Range.WITHIN;
}

export function wait(duration = 1) {
    return new Promise(ok => {
        setTimeout(ok, duration);
    });
}