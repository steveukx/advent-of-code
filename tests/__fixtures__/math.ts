
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