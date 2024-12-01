export function sortAsc<T>(input: T[]) {
    return input.sort((a, b) =>
        a === b ? 0 : (a > b ? 1 : -1));
}