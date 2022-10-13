import React from 'react'
import { render } from '@testing-library/react'

import { IClientPlugin } from '@/plugins/index.d'

import List from '..'

jest.mock('../../dialog', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

describe('components/account/hpc/list', () => {
  const plugin = { key: 'key' }
  const plugins: IClientPlugin[] = []
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
          {
            uuid: '0',
            key: '0',
            name: '0',
            configuration: {}
          },
          {
            uuid: 'uuid',
            key: 'key',
            name: 'name',
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
              item1: {
                label: 'Item1',
                type: 'input'
              },
              //@ts-ignore
              item2: { value: 'item' }
            }
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })

  test('plugins - empty configuration', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {
            uuid: '0',
            key: 'key',
            name: '0',
            configuration: {}
          },
          {
            uuid: 'uuid',
            key: '0',
            name: 'name',
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
})
