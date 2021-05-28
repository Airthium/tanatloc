import React from 'react'
import { render } from '@testing-library/react'

import HPC from '../'

let wrapper
describe('components/help/doc/hpc', () => {
  test('render', () => {
    const { unmount } = render(<HPC />)

    unmount()
  })
})
