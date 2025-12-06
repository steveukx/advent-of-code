export interface VectorLowerUpper {
    readonly lower: number;
    readonly upper: number;
    size(inclusive?: boolean): number;
    contains(test: number): boolean;
}

class Vector2D implements VectorLowerUpper {
    constructor(public readonly lower: number, public readonly upper: number) {}
    overlaps(other: Vector2D) {
        const { lower, upper } = other;
        if (lower > this.upper || upper < this.lower) {
            return false;
        }
        if (lower <= this.lower) {
            return upper >= this.lower;
        }
        if (upper >= this.upper) {
            return lower <= this.upper;
        }
        return true;
    }
    contains(point: number) {
        return point <= this.upper && point >= this.lower;
    }
    size(inclusive = false) {
        return (inclusive ? 1 : 0) + this.upper - this.lower;
    }
    compare(other: Vector2D) {
        const diff = this.lower - other.lower;
        return diff || this.upper - other.upper;
    }
    combine(other: Vector2D) {
        return new Vector2D(Math.min(this.lower, other.lower), Math.max(this.upper, other.upper));
    }
    toString () {
        return `Vector2D(${this.lower}, ${this.upper})`;
    }
}

export function pointVector(lower: number, upper: number) {
    return new Vector2D(lower, upper);
}

export function mergeVectors(vectors: Vector2D[]) {
    if (!vectors.length) { return vectors; }

    const sorted = [...vectors].sort((a, b) => a.compare(b));

    const output = sorted.splice(0, 1);
    sorted.forEach(vector => {
        const head = output.pop();

        if (vector.overlaps(head)) {
            output.push(head.combine(vector));
        }
        else {
            output.push(head, vector);
        }
    });

    return output;
}