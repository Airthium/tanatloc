import React from 'react'
import { render } from '@testing-library/react'

import Project from '@/pages/project/[id]'

jest.mock('@/components/project', () => () => <div />)

describe('pages/project', () => {
  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })
})
