import { append, changeIndex, midPointValue, readInputFrom, sumOf, toLines } from '../__fixtures__';

describe('05', () => {
    const EXAMPLE = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

    type Rules = Map<number, number[]>;
    type Update = Map<number, number>;

    interface Parsed {
        rules: Rules;
        updates: Update[];
    }

    function toUpdate(input: Array<string | number>): Update {
        return new Map(
            input.map((page, index) => [Number(page), index])
        );
    }

    function parse(input: string): Parsed {
        let parsingRules = true;
        const rules = new Map<number, number[]>();
        const updates: Update[] = [];
        toLines(input.trim()).forEach(line => {
            if (!line) {
                return void (parsingRules = false);
            }
            if (parsingRules) {
                const [left, right] = line.split('|').map(Number);
                return void (rules.set(left, append(rules.get(left), right)));
            }
            updates.push(toUpdate(line.split(',')));
        });

        return {
            rules,
            updates,
        };
    }

    function resolvedErrors({rules, updates}: Parsed) {
        const resolved: Update[] = [];
        for (let i = 0; i < updates.length; i++) {
            let update = updates[i];
            let invalidIndex = findError(rules, update);
            if (invalidIndex < 0) {
                continue;
            }

            do {
                update = toUpdate(
                    changeIndex(Array.from(update.keys()), invalidIndex, invalidIndex - 1)
                )
            } while ((invalidIndex = findError(rules, update)) >= 0)

            resolved.push(update);
        }

        return resolved;
    }

    function validUpdates({rules, updates}: Parsed) {
        return updates.filter((update, index) => {
            return findError(rules, update) < 0;
        });
    }

    function findError(rules: Rules, update: Update): number {
        for (const [page, pageRules] of rules.entries()) {
            const left = update.get(page);
            if (left === undefined) {
                continue;
            }

            for (const right of pageRules) {
                if (update.has(right) && update.get(right) < left) {
                    return left;
                }
            }
        }

        return -1;
    }

    function midPoints(valid: Parsed['updates']) {
        let numbers = valid.map(
            update => midPointValue(Array.from(update.keys()))
        );
        return sumOf(numbers)
    }

    it('example.1', () => {
        const valid = validUpdates(
            parse(EXAMPLE)
        );

        expect(midPoints(valid)).toBe(143);
    });

    it('example.2', () => {
        const updates = resolvedErrors(
            parse(EXAMPLE)
        );

        expect(midPoints(updates)).toBe(123);
    });

    it('question.2', () => {
        const updates = resolvedErrors(
            parse(readInputFrom(2024, 5, 'input'))
        );

        expect(midPoints(updates)).toBe(4077);
    });

    it('question.1', () => {
        const valid = validUpdates(
            parse(readInputFrom(2024, 5, 'input'))
        );

        expect(midPoints(valid)).toBe(5129);
    });
})