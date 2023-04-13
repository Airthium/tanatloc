import { render } from '@testing-library/react'
import CustomTooltip from '..'

describe('components/editor/code/freefem/tooltip', () => {
  test('render', () => {
    const { unmount } = render(<CustomTooltip />)

    unmount()
  })
})
