import { cleanup } from '@testing-library/react'

// @ts-expect-error global is undefined
global.IS_REACT_ACT_ENVIRONMENT = true

export const mochaHooks = {
  afterEach() {
    cleanup()
  },
}
