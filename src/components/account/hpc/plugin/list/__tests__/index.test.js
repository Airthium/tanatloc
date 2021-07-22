import React from 'react'
import { render } from '@testing-library/react'

import List from '..'

jest.mock('../../dialog', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

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

  test('plugins', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {},
          {
            uuid: 'uuid',
            key: 'key',
            configuration: {
              name: {
                value: 'name'
              },
              password: { type: 'password', value: 'password' },
              item: { value: 'item' }
            }
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })
})
