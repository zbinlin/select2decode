"use strct";

/* eslint-env jest */

import { decode } from "../base64";

describe("test base64 utils", () => {
    describe("test decode function", () => {
        it("utf8 encoding string", () => {
            const str = "5rWL6K+V";
            const expected = "测试";
            expect(decode(str)).toBe(expected);
            expect(decode(str, "utf8")).toBe(expected);
            expect(decode(str, "UTF-8")).toBe(expected);
        });
        it("hex encoding string", () => {
            const str = "5rWL6K+V";
            const expected = "e6b58be8af95";
            expect(decode(str, "hex").toLowerCase()).toBe(expected);
        });
        it("gbk encoding string", () => {
            const str = "suLK1A==";
            const expected = "测试";
            expect(decode(str, "gbk")).toBe(expected);
        });
    });
});
