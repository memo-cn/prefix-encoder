/**
 * PrefixEncoder is an interface that defines the methods for encoding and decoding values
 * with a specified prefix and escape character.
 * PrefixEncoder 是一个接口，定义了使用指定前缀和转义字符对值进行编码和解码的方法。
 * @template T - The type of the value to be encoded or decoded. 要编码或解码的值的类型。
 */
export type PrefixEncoder<T> = {
    /**
     * Encodes the given value into a string.
     * If the value is a string, it may be escaped with the escape character.
     * 将给定的值编码为字符串。如果值是字符串，则可能会使用转义字符进行转义。
     * @param {T | string} arg - The value to be encoded. 要编码的值。
     * @returns {string} - The encoded string. 编码后的字符串。
     */
    encode: (arg: T | string) => string;

    /**
     * Decodes the given string into the original value.
     * If the string has the specified prefix, it will be parsed into the original type.
     * 将给定的字符串解码为原始值。如果字符串具有指定的前缀，它将被解析为原始类型。
     * @param {string} str - The string to be decoded. 要解码的字符串。
     * @returns {T | string} - The decoded value. 解码后的值。
     */
    decode: (str: string) => T | string;
};

/**
 * EncoderOptions is an interface that defines the options required to create a prefix encoder.
 * EncoderOptions 是一个接口，定义了创建前缀编码器所需的选项。
 * @template T - The type of the value to be encoded or decoded. 要编码或解码的值的类型。
 */
export type EncoderOptions<T> = {
    /**
     * The prefix to be added to the encoded values.
     * 要添加到编码值的前缀。
     */
    prefix: string;

    /**
     * A function that serializes the value into a string.
     * 将值序列化为字符串的函数。
     * @param {T} arg - The value to be serialized. 要序列化的值。
     * @returns {string} - The serialized string. 序列化后的字符串。
     */
    stringify: (arg: T) => string;

    /**
     * A function that parses the string back into the original value.
     * 将字符串解析回原始值的函数。
     * @param {string} arg - The string to be parsed. 要解析的字符串。
     * @returns {T} - The parsed value. 解析后的值。
     */
    parse: (arg: string) => T;

    /**
     * The character used to escape values that contain the prefix.
     * 用于转义包含前缀的值的字符。
     */
    escapeCharacter: string;
};

export function createPrefixEncoder<T>({
    prefix,
    stringify,
    parse,
    escapeCharacter,
}: EncoderOptions<T>): PrefixEncoder<T> {
    return {
        encode,
        decode,
    };

    function indexOfPrefix(str: string) {
        for (let i = 0; i < str.length; ++i) {
            const char = str[i];
            if (char === prefix[0]) {
                if (str.slice(i, i + prefix.length) === prefix) {
                    return i;
                }
            }
            if (str[i] !== escapeCharacter) {
                return -1;
            }
        }
        return -1;
    }

    function encode(arg: T | string): string {
        if (typeof arg === 'string') {
            let ind = indexOfPrefix(arg);
            if (ind === -1) return arg;
            return escapeCharacter.repeat(ind + 1) + arg.slice(ind);
        }
        return prefix + stringify(arg);
    }

    function decode(str: string): T | string {
        const ind = indexOfPrefix(str);
        if (ind === -1) {
            return str;
        }
        if (ind === 0) {
            const path = str.slice(prefix.length);
            return parse(path);
        }
        return escapeCharacter.repeat(ind - 1) + str.slice(ind);
    }
}
