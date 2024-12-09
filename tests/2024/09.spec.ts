import { anArray, append, appendItem, readInputFrom, sumOf } from '../__fixtures__';
import { sumBy } from 'lodash';

type Block = { files: number[], free: number, file: boolean, compacted: boolean };

describe('09', () => {
    const EXAMPLE = `2333133121414131402`;

    function compactorV1(files: number[], gaps: number[]): number[] {
        const ids: number[] = [];
        for (let i = 0; i < files.length; i++) {
            ids.push(...Array(files[i]).fill(i));
            ids.push(
                ...anArray(gaps[i], () => {
                    const lastIndex = files.length - 1;
                    if (lastIndex <= i) {
                        return 0;
                    }
                    if ((files[lastIndex] -= 1) < 1) {
                        files.pop();
                    }
                    return lastIndex;
                })
            );
        }
        return ids;
    }

    function compactorV2(files: number[], gaps: number[]): number[] {
        const newGap = (free = 0) => ({files: [], free, file: false, compacted: false});
        const fileBlocks: Block[] = [];
        const blocks: Block[] = files.flatMap((size, index) => {
            return [
                appendItem(fileBlocks, {files: Array(size).fill(index), free: 0, file: true, compacted: false}),
                newGap(gaps[index]),
            ]
        });

        function mergeGaps() {
            for (let i = blocks.length - 1; i > 0; i--) {
                const right = blocks.at(i);
                const left = blocks.at(i - 1);
                if (right.file || left.file) {
                    continue;
                }

                left.free += right.free;
                blocks.splice(i, 1);
            }
        }

        for (let i = fileBlocks.length - 1; i > 0; i--) {
            const file = fileBlocks[i];
            for (let j = 1; j < blocks.length; j++) {
                const target = blocks[j];
                if (target === file) {
                    break;
                }

                if (target.file || target.free < file.files.length) {
                    continue;
                }

                const at = blocks.indexOf(file);

                target.free -= file.files.length;

                file.compacted = true;
                blocks.splice(at, 1, newGap(file.files.length));
                blocks.splice(j, 0, newGap(), file, newGap());

                mergeGaps();

                break;
            }
        }

        return blocks.flatMap(block => {
            return block.file ? block.files : Array(block.free).fill(0);
        });
    }

    function parse(input: string, compactor = compactorV1) {
        const files: number[] = [];
        const gaps: number[] = [];
        for (let i = 0, target = files; i < input.length; i++) {
            target.push(Number(input[i]));
            target = target === files ? gaps : files;
        }

        if (files.length > gaps.length) {
            gaps.push(0);
        }

        const ids = compactor(files, gaps);

        const checksum = sumOf(
            ids.map((id, index) => id * index)
        );

        return {
            ids,
            files,
            gaps,
            checksum,
        }
    }

    it('example.1', () => {
        expect(parse(EXAMPLE).checksum).toBe(1928);
    });
    it('question.1', () => {
        expect(parse(readInputFrom(2024, 9)).checksum).toBe(6288599492129);
    });
    it('example.2', () => {
        expect(parse(EXAMPLE, compactorV2).checksum).toBe(2858);
    });
    it('question.2', () => {
        expect(parse(readInputFrom(2024, 9), compactorV2).checksum).toBe(6321896265143);
    });

})