# prefix-encoder<a href="https://github.com/memo-cn/prefix-encoder/blob/main/README.zh-CN.md"><img src="https://img.shields.io/npm/v/prefix-encoder.svg" /></a> <a href="https://github.com/memo-cn/prefix-encoder/blob/main/README.zh-CN.md"><img src="https://packagephobia.now.sh/badge?p=prefix-encoder" /></a>

[English](https://github.com/memo-cn/prefix-encoder/blob/main/README.md) | [简体中文](https://github.com/memo-cn/prefix-encoder/blob/main/README.zh-CN.md)

## 介绍

前缀编码器（Prefix Encoder）是一种用于编码和解码字符串及其他类型值的方案。通过给序列化结果添加类型前缀，区分序列化前的原始值类型。

- 类型 T 序列化为字符串的算法、类型前缀及转义字符均由你设定。
- 常规字符串的序列化结果为其自身；如有必要，前缀编码器会添加转义字符以避免冲突。

## 接口

`createPrefixEncoder` 方法根据传入的 `EncoderOptions` 创建并返回一个 `PrefixEncoder` 实例。

### `EncoderOptions`

配置对象包含以下属性:

| 属性            | 类型               | 作用                            |
| --------------- | ------------------ | ------------------------------- |
| prefix          | string             | 类型 T 被编码为字符串后的前缀。 |
| stringify       | (arg: T) => string | 类型 T 的序列化方法。           |
| parse           | (arg: string) => T | 类型 T 的反序列化方法。         |
| escapeCharacter | string             | 转义字符。                      |

### `PrefixEncoder`

提供了以下方法:

| 方法     | 类型                         | 作用                                    |
| -------- | ---------------------------- | --------------------------------------- |
| `encode` | (arg: T \| string) => string | 将字符串或其他 T 类型值编码为字符串。   |
| `decode` | (str: string) => T \| string | 将字符串解码回原来的字符串或 T 类型值。 |

## 示例

### `Bigint`

以下示例代码创建了处理 `BigInt` 的编码器, 并对 `BigInt` 数值或字符串进行编码和解码操作。

```ts
import {createPrefixEncoder} from 'prefix-encoder';

const bigIntEncoder = createPrefixEncoder<bigint>({
    prefix: '$big-int:',
    // 将 BigInt 值序列化为字符串。
    stringify: (num: bigint) => String(num),
    // 将字符串反序列化回 BigInt 值。
    parse: (str: string) => BigInt(str),
    // 用于处理包含前缀的字符串的转义字符。
    escapeCharacter: '_',
});

// 使用指定的前缀将 BigInt 值 2025n 编码为字符串。
// 结果是一个以 "$big-int:" 为前缀的字符串。
// "$big-int:2025"
console.log(bigIntEncoder.encode(2025n));

// 解码一个编码后的字符串，以获取原始的 BigInt 值。
// 输入的字符串应该是以 "$big-int:" 为前缀的格式。
// 1234n
console.log(bigIntEncoder.decode('$big-int:1234'));

// 对一个不符合编码格式的普通字符串进行编码, 将原样返回。
// "hello, world"
console.log(bigIntEncoder.encode('hello, world'));

// 解码一个不符合编码格式的普通字符串, 也将原样返回。
// "hello, world"
console.log(bigIntEncoder.decode('hello, world'));

// 对已经包含前缀的字符串进行编码, 为避免混淆，会在前面添加转义字符 "_"。
// "_$big-int:2025"
console.log(bigIntEncoder.encode('$big-int:2025'));
```

### `Date`

以下代码展示了针对 `Date` 类型的编码器的创建和使用。

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

## 许可

[MIT](./LICENSE)
