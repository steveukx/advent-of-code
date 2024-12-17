import { max } from 'lodash';

describe('17', () => {

    class Computer {
        private _pointer = 0;
        private readonly _logs: number[] = [];
        private readonly instructions: number[];

        constructor(
            public registerA = 0,
            public registerB = 0,
            public registerC = 0,
            instructions = '',
        ) {
            this.instructions = instructions.split(',').map(Number);
        }

        jump(index: number) {
            this._pointer = index;
        }

        log(statement: number) {
            this._logs.push(statement);
        }

        exec(sigterm?: () => boolean) {
            this._logs.length = this._pointer = 0;

            const maxPointer = this.instructions.length;
            while (this._pointer < maxPointer) {
                const pointer = this._pointer;
                const opcode = OP_CODES[this.instructions[pointer]];
                const operand = this.instructions[pointer + 1];

                if (!opcode) {
                    throw new Error(`Failed to find valid opcode`);
                }

                opcode(operand, this);

                if (sigterm?.() === true) {
                    break;
                }

                if (this._pointer === pointer) {
                    this._pointer += 2;
                }
            }

            return this._logs.join(',');
        }

        search(start = 0, finish = start + 1000000000) {
            const original = this.registerA;
            const expected = this.instructions.join(',');

            let terminate = false;
            this.log = (value) => {
                if (value !== this.instructions[this._logs.length]) {
                    terminate = true;
                }
                this._logs.push(value);
            };

            for (let registerA = start; registerA < finish; registerA++) {
                if (registerA === original) {
                    continue;
                }

                if (!(registerA % 500000)) {
                    console.log(`Trying ${registerA}`);
                }

                terminate = false;

                this.registerB = this.registerC = 0;
                this.registerA = registerA;

                if (this.exec(() => terminate) === expected && !terminate) {
                    delete this.log;
                    return registerA;
                }
            }

            delete this.log;
            return -1;
        }
    }

    function literal(operand: number) {
        return operand;
    }

    function combo(operand: number, computer: Computer) {
        if (operand < 0 || operand > 6) {
            throw new Error('Invalid combo operand: ' + operand);
        }
        switch (operand) {
            case 6:
                return computer.registerC;
            case 5:
                return computer.registerB;
            case 4:
                return computer.registerA;
            default:
                return operand;
        }
    }

    const OP_CODES: Array<(operand: number, computer: Computer) => void> = [
        function adv(operand, computer) {
            computer.registerA = Math.trunc(
                computer.registerA / Math.pow(2, combo(operand, computer))
            );
        },
        function bxl(operand, computer) {
            computer.registerB =
                computer.registerB ^ literal(operand);
        },
        function bst(operand, computer) {
            computer.registerB = combo(operand, computer) % 8;
        },
        function jnz(operand, computer) {
            if (!computer.registerA) {
                return;
            }
            computer.jump(literal(operand));
        },
        function bxc(operand, computer) {
            computer.registerB = computer.registerB ^ computer.registerC;
        },
        function out(operand, computer) {
            computer.log(combo(operand, computer) % 8);
        },
        function bdv(operand, computer) {
            computer.registerB = Math.trunc(
                computer.registerA / Math.pow(2, combo(operand, computer))
            );
        },
        function cdv(operand, computer) {
            computer.registerC = Math.trunc(
                computer.registerA / Math.pow(2, combo(operand, computer))
            );
        },
    ];

    it('example.1', () => {
        const computer= new Computer(729, 0, 0, '0,1,5,4,3,0');
        expect(computer.exec()).toBe('4,6,3,5,6,3,5,2,1,0');
    });

    it('question.1', () => {
        const computer= new Computer(38610541, 0, 0, '2,4,1,1,7,5,1,5,4,3,5,5,0,3,3,0');
        expect(computer.exec()).toBe('4,6,3,5,6,3,5,2,1,0');
    });

    it('example.2', () => {
        const computer= new Computer(2024, 0, 0, '0,3,5,4,3,0');
        expect(computer.search(110000)).toBe(117440);
    });


    it('question.2', () => {
        const computer= new Computer(38610541, 0, 0, '2,4,1,1,7,5,1,5,4,3,5,5,0,3,3,0');
        expect(computer.search(1619000000)).toBe(0);
    });

})