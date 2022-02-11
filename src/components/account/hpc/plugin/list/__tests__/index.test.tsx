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
                label: 'Name',
                type: 'input',
                value: 'name'
              },
              password: {
                label: 'Password',
                type: 'password',
                value: 'password'
              },
              textarea: {
                label: 'Textarea',
                type: 'textarea',
                value: 'code'
              },
              //@ts-ignore
              item: { value: 'item' }
            }
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })

  test('plugins, without configuration', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {},
          {
            uuid: 'uuid',
            key: 'key',
            configuration: {}
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })
})
