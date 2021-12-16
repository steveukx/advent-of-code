import { like, readInputFrom } from '../__fixtures__';

describe('Year 2021: Day 16', () => {

    const inputData = readInputFrom(2021, 16, 'input');

    const BIN = {
        '0000': 0,
        '0001': 1,
        '0010': 2,
        '0011': 3,
        '0100': 4,
        '0101': 5,
        '0110': 6,
        '0111': 7,
        '1000': 8,
        '1001': 9,
        '1010': 'A',
        '1011': 'B',
        '1100': 'C',
        '1101': 'D',
        '1110': 'E',
        '1111': 'F',
    };

    const HEX: Record<string, string> = Object.fromEntries(
        Object.entries(BIN).map(([key, value]) => [value, key])
    );

    function hexToBin(input: string) {
        let output = '';
        for (let i = 0, max = input.length; i < max; i++) {
            output += HEX[input.charAt(i)];
        }

        return output;
    }

    function parse(input: string) {
        return BIN[input.padStart(4, '0') as keyof typeof BIN];
    }

    type TPacket = {
        offset: number;
        tail: string;
        bits: Array<string>;
        type: number | string;
        version: number;
        value: number;
        packets?: TPacket[];
    }

    function packet(input: string): TPacket {
        let offset = 0;

        const version = +parse(input.substring(offset, offset += 3));
        const type = parse(input.substring(offset, offset += 3));
        const length = type === 4 ? 0 : input.substring(offset, offset += 1) === '1' ? 11 : 15;
        const packets: TPacket[] = [];

        const bits: Array<string> = [];

        for (let i = 0, max = parseInt(input.substring(offset, offset += length) || '0', 2); i < max;) {
            const sub = packet(input.substring(offset));
            packets.push(sub);
            offset += sub.offset;
            i += (length === 15) ? sub.offset : 1;
        }

        if (packets.length) {
            return {
                get value() {
                    switch (type) {
                        case 0:
                            return packets.reduce((count, item) => count + item.value, 0);
                        case 1:
                            return packets.reduce((count, item) => count * item.value, 1);
                        case 2:
                            return Math.min(...packets.map(item => item.value));
                        case 3:
                            return Math.max(...packets.map(item => item.value));
                        case 5:
                            if (packets.length !== 2) throw new Error('Greater than should have two packets');
                            return packets[0].value > packets[1].value ? 1 : 0;
                        case 6:
                            if (packets.length !== 2) throw new Error('Less than should have two packets');
                            return packets[0].value < packets[1].value ? 1 : 0;
                        case 7:
                            if (packets.length !== 2) throw new Error('Equal should have two packets');
                            return packets[0].value === packets[1].value ? 1 : 0;
                    }

                    return 0;
                },
                version,
                type,
                bits,
                offset,
                packets,
                tail: input.substring(offset),
            };
        }

        if (type !== 4) {
            throw new Error(`Operator found without packets`);
        }

        do {
            const loop = input.substring(offset, offset += 1) === '1';
            bits.push(input.substring(offset, offset += 4));

            if (!loop) {
                break;
            }
        } while (true);


        return {
            version,
            type,
            bits,
            value: parseInt(bits.join(''), 2),
            offset,
            packets,
            tail: input.substring(offset),
        };
    }

    it('converts from hex', () => {
        expect(hexToBin('D2FE28')).toBe('110100101111111000101000');
        expect(hexToBin('38006F45291200')).toBe('00111000000000000110111101000101001010010001001000000000');
        expect(hexToBin('EE00D40C823060')).toBe('11101110000000001101010000001100100000100011000001100000');
    });

    it('reads a packet', () => {
        const bin = hexToBin('D2FE28');
        const actual = packet(bin);

        expect(actual).toEqual(like({value: 2021, type: 4, version: 6, tail: '000'}));
    });

    it('reads a v1 operator packet', () => {
        const actual = packet('00111000000000000110111101000101001010010001001000000000');

        expect(actual).toEqual(like({
            version: 1,
            type: 6,
            packets: [
                like({type: 4, value: 10}),
                like({type: 4, value: 20}),
            ],
        }))
    });

    it('reads a v7 operator packet', () => {
        const actual = packet('11101110000000001101010000001100100000100011000001100000');

        expect(actual).toEqual(like({
            version: 7,
            type: 3,
            packets: [
                like({type: 4, value: 1}),
                like({type: 4, value: 2}),
                like({type: 4, value: 3}),
            ],
        }))
    });

    function versionCount(input: TPacket): number {
        return input.version + (input.packets?.reduce((count, item) => count + versionCount(item), 0) || 0);
    }

    it('prepares for question one', () => {
        const bin = hexToBin('8A004A801A8002F478');
        expect(packet(bin)).toEqual(like({
            version: 4,
            packets: [
                like({
                    version: 1,
                    packets: [
                        like({
                            version: 5,
                            packets: [
                                like({
                                    version: 6,
                                    type: 4,
                                })
                            ]
                        })
                    ]
                })
            ]
        }));
    });

    it.each([
        ['8A004A801A8002F478', 16],
        ['620080001611562C8802118E34', 12],
        ['C0015000016115A2E0802F182340', 23],
        ['A0016C880162017C3686B18A3D4780', 31],
    ])('counts versions in %s', (hex, expected) => {
        expect(versionCount(packet(hexToBin(hex)))).toBe(expected);
    })

    it('tries question one', () => {
        expect(versionCount(packet(hexToBin(inputData)))).toBe(883)
    })

    it('tries question two', () => {
        expect(packet(hexToBin(inputData)).value).toBe(1675198555015)
    })

    it.each([
        ['C200B40A82', 3],
        ['04005AC33890', 54],
        ['880086C3E88112', 7],
        ['CE00C43D881120', 9],
        ['D8005AC2A8F0', 1],
        ['F600BC2D8F', 0],
        ['9C005AC2F8F0', 0],
        ['9C0141080250320F1802104A08', 1],
    ])('generates values in %s', (hex, expected) => {
        expect(packet(hexToBin(hex))).toHaveProperty('value', expected);
    });

})