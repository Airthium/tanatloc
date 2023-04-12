import { render } from '@testing-library/react'

import Project from '../project.page'
import ProjectId from '../project/[id].page'

jest.mock('@/components/project', () => () => <div />)

describe('pages/project', () => {
  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })

  test('[id]', () => {
    const { unmount } = render(<ProjectId />)

    unmount()
  })
})
