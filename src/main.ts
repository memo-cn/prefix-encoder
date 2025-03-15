import { createPrefixEncoder } from '../lib';

dateDemo();
function dateDemo() {
    const dateEncoder = createPrefixEncoder<Date>({
        escapeCharacter: '_',
        prefix: '$time:',
        stringify: (date: Date) => String(date.getTime()),
        parse: (str: string) => new Date(Number(str)),
    });

    // "$time:818035920000"
    console.log(dateEncoder.encode(new Date('04 Dec 1995 00:12:00 GMT')));

    // Date: Thu Jan 01 1970 01:00:00 GMT+0100
    console.log(dateEncoder.decode('$time:0'));
}

bigIntDemo();
function bigIntDemo() {
    const bigIntEncoder = createPrefixEncoder<bigint>({
        prefix: '$big-int:',
        stringify(num: bigint) {
            return String(num);
        },
        parse(str: string) {
            return BigInt(str);
        },
        escapeCharacter: '_',
    });

    // "$big-int:2025"
    console.log(bigIntEncoder.encode(2025n));

    // "_$big-int:2025"
    console.log(bigIntEncoder.encode('$big-int:2025'));

    // 1234n
    console.log(bigIntEncoder.decode('$big-int:1234'));

    // "hello, world"
    console.log(bigIntEncoder.decode('hello, world'));
}
