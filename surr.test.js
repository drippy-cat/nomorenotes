const surr = require('./surr.js')

describe('surr', () => {
    /**
     * @type {Array<(name: string, cb: (str: string, i: number) => void) => void>}
     */
    let fns = []
    /** @type {[string, boolean][]} */
    const strs = [["abigail", false], ["😊❤️👍🏻👎🏿", true], ["", false]]
    for (const [str] of strs) {
        for (let i = 0; i < str.length; i++) {
            fns.push((name, cb) => it.concurrent(`${name} [str=${JSON.stringify(str)}, i=${JSON.stringify(i)}]`, () => cb(str, i)))
        }
    }
    const cafe = fns.reduce((a, b) => (str, i) => (a(str, i), b(str, i)))

    describe(".unsurrogate()", () => {
        cafe("reverses .surrogate()", (str, i) => {
            expect(surr.unsurrogate(surr.surrogate(i, str), str)).toStrictEqual(i)
        })
        for (let example of [24, NaN, {}, false, Symbol("bad idea")]) {
            it.concurrent(`should throw on a ${typeof example}`, () => {
                // @ts-expect-error
                expect(() => surr.unsurrogate(5, example)).toThrow(TypeError)
            })
        }
    })
    describe(".surrogate()", () => {
        cafe("reverses .unsurrogate()", (str, i) => {
            expect(surr.unsurrogate(surr.surrogate(i, str), str)).toStrictEqual(i)
        })
        for (let example of [24, NaN, {}, false, Symbol("bad idea")]) {
            it.concurrent(`should throw on a ${typeof example}`, () => {
                // @ts-expect-error
                expect(() => surr.surrogate(5, example)).toThrow(TypeError)
            })
        }
    })
    describe(".issurrogate", () => {
        for (let [str, issurr] of strs) {
            it.concurrent(`should return the correct value [${JSON.stringify(str)}, expected=${issurr}]`, () => {
                expect(surr.issurrogate(str))
            })
        }
    })
})