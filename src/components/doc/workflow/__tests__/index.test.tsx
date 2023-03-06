import { render } from '@testing-library/react'

import Workflow from '..'

describe('components/doc/workflow', () => {
  test('render', () => {
    const { unmount } = render(<Workflow />)

    unmount()
  })
})
