import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Account from '..'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

jest.mock('../information', () => {
  const Information = () => <div />
  return Information
})

jest.mock('../password', () => {
  const Password = () => <div />
  return Password
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('../hpc', () => {
  const HPC = () => <div />
  return HPC
})

describe('components/account', () => {
  const user = { email: 'email', authorizedplugins: [] }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Account user={user} swr={swr} />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Account user={user} swr={swr} />)

    const tab = screen.getByRole('tab', { name: 'Security' })
    fireEvent.click(tab)

    expect(mockReplace).toHaveBeenCalledTimes(1)

    unmount()
  })
})
