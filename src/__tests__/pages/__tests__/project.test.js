import React from 'react'
import { render } from '@testing-library/react'

import Project from '@/pages/project'

jest.mock('@/components/project', () => 'project')

describe('pages/project', () => {
  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })
})
