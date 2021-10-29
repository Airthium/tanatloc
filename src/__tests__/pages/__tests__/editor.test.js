import React from 'react'
import { render } from '@testing-library/react'

import Editor from '@/pages/editor'

jest.mock('@/components/editor', () => () => <div />)

describe('pages/editor', () => {
  test('render', () => {
    const { unmount } = render(<Editor />)

    unmount()
  })
})
