import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import List from '..'

jest.mock('../..', () => () => <div />)
jest.mock('../../add', () => () => <div />)

describe('components/workspace/list', () => {
  const user = { id: 'id' }
  const workspaces = [{ id: 'id' }]
  const organizations = [{}]
  const swr = {
    addOneWorkspace: jest.fn(),
    mutateOneWorkspace: jest.fn(),
    delOneWorkspace: jest.fn()
  }

  beforeEach(() => {
    swr.addOneWorkspace.mockReset()
    swr.mutateOneWorkspace.mockReset()
    swr.delOneWorkspace.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('edit', async () => {
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    const add = screen.getAllByRole('button', { name: 'Add tab' })
    fireEvent.click(add[0])

    unmount()
  })
})
