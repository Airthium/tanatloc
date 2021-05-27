import React from 'react'
import { render, screen } from '@testing-library/react'

import List from '..'

jest.mock('../../dialog', () => {
  const PluginDialog = () => <div />
  return PluginDialog
})

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

describe('components/account/hpc/list', () => {
  const plugin = { key: 'key' }
  const plugins = [{}]
  const swr = {
    delOnePlugin: jest.fn(),
    mutateOnePlugin: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(
      <List plugin={plugin} plugins={plugins} swr={swr} />
    )

    unmount()
  })

  // test('mount', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <List
  //       plugin={plugin}
  //       plugins={[
  //         {},
  //         {
  //           uuid: 'uuid',
  //           key: 'key',
  //           configuration: {
  //             name: {
  //               value: 'name'
  //             },
  //             password: { type: 'password', value: 'password' },
  //             item: { value: 'item' }
  //           }
  //         }
  //       ]}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })
})
