
export function like<T>(objectContaining: Partial<T>) {
    return expect.objectContaining(objectContaining);
}