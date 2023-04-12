import { render } from '@testing-library/react'

import Editor from '../editor.page'

jest.mock('@/components/editor', () => () => <div />)

describe('pages/editor', () => {
  test('render', () => {
    const { unmount } = render(<Editor />)

    unmount()
  })
})
