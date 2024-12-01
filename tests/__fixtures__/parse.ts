
const trim = String.prototype.trim.call.bind(String.prototype.trim) as (input: string) => string;

export function toStringArray(input: string, trimmed = true, split = '\n') {
    let output = (trimmed ? input.trim() : input).split(split);
    return trimmed ? output.map(trim) : output;
}

export function toNumber(input: string, radix = 10) {
    return parseInt(input, radix);
}