
export function greatestCommonDenominator(a: number, b: number) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

export function lowestCommonMultiplier(a = 1, b = 1, ...rest: number[]): number {
    const lcm = Math.abs(a * b) / greatestCommonDenominator(a, b);
    return rest.length ? lowestCommonMultiplier(lcm, rest[0], ...rest.slice(1)) : lcm;
}

export function sum(...numbers: Array<string | number>) {
    return sumOf(numbers);
}

export function sumOf(numbers: Array<string | number>) {
    return numbers.reduce((count: number, item) => {
        return count + (parseInt(String(item), 10) || 0);
    }, 0);
}

export function productOf(numbers: Array<number>) {
    return numbers.reduce((count: number, item) => count * item, 1);
}

export const factorial = Object.assign(function (distance: number) {
    if (!factorial.cache.has(distance)) {
        factorial.cache.set(distance, Array(distance).fill(0).reduce((result, _, index) => result + index + 1, 0));
    }

    return factorial.cache.get(distance)!;
}, {
    cache: new Map<number, number>()
});
