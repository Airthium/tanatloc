import React from 'react'
import { render, screen } from '@testing-library/react'

import Project from '@/pages/project/[id]'

jest.mock('@/components/project', () => 'project')

describe('pages/project', () => {
  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })
})
