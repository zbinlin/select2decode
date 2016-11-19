"use strict";

import textEncoding from "text-encoding";

const { TextDecoder } = textEncoding;

const DICT = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function base64Decode(str) {
    str = str.replace(/\s/g, "");
    const len = Math.floor(str.length / 4);
    const ary = [];
    for (let i = 0; i < len; i++) {
        const idx = i * 4;
        const a = DICT.indexOf(str[idx]);
        const b = DICT.indexOf(str[idx + 1]);
        const c = DICT.indexOf(str[idx + 2]);
        const d = DICT.indexOf(str[idx + 3]);
        if (a === -1 || b === -1 || c === -1 || d === -1) {
            throw new Error("invalid base64 string");
        }
        ary.push(a << 2 | b >> 4);
        if (c < 64) {
            ary.push((b << 4 | c >> 2) & 0xFF);
            if (d < 64) {
                ary.push((c << 6 | d) & 0xFF);
            }
        }
    }
    return ary;
}

export function encode(string) {
    return btoa(string);
}

export function decode(base64String, encoding = "UTF-8") {
    const ary = base64Decode(base64String);
    if (encoding === "hex") {
        return ary.map(ch => ch.toString(16)).join("");
    }
    const decoder = new TextDecoder(encoding);
    const u8Ary = new Uint8Array(ary.length);
    for (let i = 0, len = ary.length; i < len; i++) {
        u8Ary[i] = ary[i];
    }
    return decoder.decode(u8Ary);
}
