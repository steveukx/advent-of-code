import { find, matchesProperty, pullAllBy, reduce, sumBy } from 'lodash';
import { readInputFrom, sumOf } from '../__fixtures__';

describe('15', function () {
    const INPUT = readInputFrom(2023, 15, 'input');
    const EXAMPLE = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

    function HASH(input: string) {
        return reduce(input, (count, str) => {
            return ((count + str.charCodeAt(0)) * 17) % 256;
        }, 0);
    }

    function SEQ(input: string) {
        return sumBy(input.split(','), HASH);
    }

    function BOX(input: string) {
        const boxes: Array<{ label: string, lens: number }>[] = Array.from({length: 256}, () => []);

        input.split(',').forEach(token => {
            const [, label, cmd, lens] = /^([a-z]+)([-=])(\d+)?$/.exec(token)!;
            const box = boxes[HASH(label)];
            if (cmd === '-') {
                pullAllBy(box, [{label}], 'label');
            } else if (cmd === '=' && lens) {
                const existing = find(box, matchesProperty('label', label));
                if (existing) {
                    existing.lens = +lens;
                } else {
                    box.push({label, lens: +lens});
                }
            } else {
                throw new Error(`Unknown command: ${label}:${cmd}:${lens}`);
            }
        });

        return sumOf(
            boxes.map((box, boxIndex) => {
                return box.reduce((count, {lens}, slot) => {
                    return count + (
                        (boxIndex + 1) * (slot + 1) * lens
                    );
                }, 0);
            })
        );
    }

    it('ex1', () => {
        expect(SEQ(EXAMPLE)).toBe(1320)
    });

    it('ex2', () => {
        expect(BOX(EXAMPLE)).toBe(145);
    });

    it('q1', () => {
        console.log(SEQ(INPUT));
    })

    it('q2', () => {
        console.log(BOX(INPUT));
    })
});