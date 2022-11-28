import { render } from '@testing-library/react'

import HPC from '../'

describe('components/help/doc/hpc', () => {
  test('render', () => {
    const { unmount } = render(<HPC />)

    unmount()
  })
})
