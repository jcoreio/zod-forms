import { assertEqual } from './util/assertEqual'
import { DeepPartial } from '../src/util/DeepPartial'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DeepPartialTest() {
  assertEqual<
    DeepPartial<{ foo: { bar: number }[]; baz: [number, string] }>,
    {
      foo?: ({ bar?: number } | undefined)[]
      baz?: [number?, string?]
    }
  >(true)
}
