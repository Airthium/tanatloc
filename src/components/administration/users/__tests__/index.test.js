import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Users from '..'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../edit', () => {
  const Edit = () => <div />
  return Edit
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('@/plugins', () => ({
  key: {
    name: 'name',
    category: 'category'
  }
}))

describe('components/administration/users', () => {
  const users = [{}]
  const swr = {
    addOneUser: jest.fn(),
    delOneUser: jest.fn(),
    mutateOneUser: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    unmount()
  })

  // test('columns', () => {
  //   const columns = wrapper.find('Table').props().columns

  //   // Sorters
  //   columns[0].sorter({ firstname: 'a' }, { firstname: 'b' })
  //   columns[1].sorter({ lastname: 'a' }, { lastname: 'b' })
  //   columns[2].sorter({ emailname: 'a' }, { emailname: 'b' })

  //   // Renders
  //   columns[3].render()
  //   columns[4].render(['key'])
  //   columns[5].render(true)
  //   columns[5].render(false)
  //   columns[6].render()
  // })
})
