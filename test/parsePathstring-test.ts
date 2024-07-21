import { describe, it } from 'mocha'
import { expect } from 'chai'
import { BasePath } from '../src/FieldPath'
import { parsePathstring } from '../src/util/parsePathstring'

describe(`parsePathstring`, function () {
  for (const [input, expected] of [
    ['foo.32.bar', ['foo', '32', 'bar']],
    [
      'foo.bar.baz["q\\nu][\\"x"][32].blah',
      ['foo', 'bar', 'baz', 'q\nu]["x', 32, 'blah'],
    ],
    [
      '[32].foo.bar.baz["q\\nu][\\"x"].blah',
      [32, 'foo', 'bar', 'baz', 'q\nu]["x', 'blah'],
    ],
    ['[3]', [3]],
    ["['a\"b']", ['a"b']],
    ['.hello', new Error('invalid pathstring: .hello (at 0)')],
    ['a[foo]', new Error('invalid pathstring: a[foo] (at 1)')],
    ['a["foo]', new Error('invalid pathstring: a["foo] (at 1)')],
    ["a['foo]", new Error("invalid pathstring: a['foo] (at 1)")],
    ['a[foo"]', new Error('invalid pathstring: a[foo"] (at 1)')],
    ['a[32a]', new Error('invalid pathstring: a[32a] (at 1)')],
    ['a[a32]', new Error('invalid pathstring: a[a32] (at 1)')],
    ['a[]', new Error('invalid pathstring: a[] (at 1)')],
    ['[', new Error('invalid pathstring: [ (at 0)')],
    [']', new Error('invalid pathstring: ] (at 0)')],
    ['.', new Error('invalid pathstring: . (at 0)')],
    ['a..b', new Error('invalid pathstring: a..b (at 2)')],
  ] as [string, BasePath | Error][]) {
    it(input, function () {
      if (expected instanceof Error) {
        expect(() => parsePathstring(input)).to.throw(Error, expected.message)
      } else {
        expect(parsePathstring(input)).to.deep.equal(expected)
      }
    })
  }
})
