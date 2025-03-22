# prefix-encoder <a href="https://github.com/memo-cn/prefix-encoder/blob/main/README.md"><img src="https://img.shields.io/npm/v/prefix-encoder.svg" /></a> <a href="https://github.com/memo-cn/prefix-encoder/blob/main/README.md"><img src="https://packagephobia.now.sh/badge?p=prefix-encoder" /></a>

[English](https://github.com/memo-cn/prefix-encoder/blob/main/README.md) | [简体中文](https://github.com/memo-cn/prefix-encoder/blob/main/README.zh-CN.md)

## Introduction

The Prefix Encoder supports encoding an original string and another type of value (denoted as type T) into a string. By adding a type prefix to the serialized result, it distinguishes the original value type before serialization.

- The algorithm for serializing type T to a string, as well as the type prefix and escape characters, are all set by you.
- The serialization result of a regular string is the string itself; if necessary, the Prefix Encoder will add escape characters to avoid conflicts.

## Interfaces

The `createPrefixEncoder` method creates and returns a `PrefixEncoder` instance based on the passed-in `EncoderOptions`.

### `EncoderOptions`

The configuration object contains the following properties:

| Property        | Type               | Function                                          |
| --------------- | ------------------ | ------------------------------------------------- |
| prefix          | string             | The prefix added to the encoded string of type T. |
| stringify       | (arg: T) => string | The serialization method for type T.              |
| parse           | (arg: string) => T | The deserialization method for type T.            |
| escapeCharacter | string             | The escape character.                             |

### `PrefixEncoder`

Provides the following methods:

| Method   | Type                         | Function                                                             |
| -------- | ---------------------------- | -------------------------------------------------------------------- |
| `encode` | (arg: T \| string) => string | Encodes a string or a value of type T into a string.                 |
| `decode` | (str: string) => T \| string | Decodes a string back into the original string or a value of type T. |

## Examples

### `Bigint`

The following sample code creates an encoder for handling `BigInt` and performs encoding and decoding operations on `BigInt` values or strings.

```typescript
import {createPrefixEncoder} from 'prefix-encoder';

const bigIntEncoder = createPrefixEncoder<bigint>({
    prefix: '$big-int:',
    // Serialize a BigInt value into a string.
    stringify: (num: bigint) => String(num),
    // Deserialize a string back to a BigInt value.
    parse: (str: string) => BigInt(str),
    // The escape character used to handle strings containing the prefix.
    escapeCharacter: '_',
});

// Encode the BigInt value 2025n into a string with the specified prefix.
// The result is a string prefixed with "$big-int:".
// "$big-int:2025"
console.log(bigIntEncoder.encode(2025n));

// Decode an encoded string to obtain the original BigInt value.
// The input string should be in the format prefixed with "$big-int:".
// 1234n
console.log(bigIntEncoder.decode('$big-int:1234'));

// Encode a normal string that does not match the encoding format, and it will be returned as it is.
// "hello, world"
console.log(bigIntEncoder.encode('hello, world'));

// Decode a normal string that does not match the encoding format, and it will also be returned as it is.
// "hello, world"
console.log(bigIntEncoder.decode('hello, world'));

// Encode a string that already contains the prefix. To avoid confusion, the escape character "_" will be added at the beginning.
// "_$big-int:2025"
console.log(bigIntEncoder.encode('$big-int:2025'));
```

### `Date`

The following code demonstrates the creation and usage of an encoder for the `Date` type.

```ts
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
```

## License

[MIT](./LICENSE)
