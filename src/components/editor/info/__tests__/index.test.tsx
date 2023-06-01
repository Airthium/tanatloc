import { render } from '@testing-library/react'

import Info from '..'

import { IModel } from '@/models/index.d'

import { EditorContext } from '@/context/editor'

jest.mock('@/lib/utils', () => ({
  userToAvatar: () => <div />,
  groupToAvatar: () => <div />
}))

describe('components/editor/info', () => {
  const user = {
    usermodels: [
      {
        id: 'id',
        model: {} as IModel,
        template: '',
        owners: [{ id: 'ido', email: 'email' }],
        users: [],
        groups: []
      }
    ]
  }

  const user2 = {
    usermodels: [
      {
        id: 'id',
        model: {} as IModel,
        template: '',
        owners: [{ id: 'ido', email: 'email' }],
        users: [{ id: 'idu', email: 'email' }],
        groups: [{ id: 'idg', name: 'name' }]
      }
    ]
  }

  test('render', () => {
    const { unmount } = render(<Info user={user} />)

    unmount()
  })

  test('user', () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          id: 'id',
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          dispatch: jest.fn
        }}
      >
        <Info user={user} />
      </EditorContext.Provider>
    )

    unmount()
  })

  test('user2', () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          id: 'id',
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          dispatch: jest.fn
        }}
      >
        <Info user={user2} />
      </EditorContext.Provider>
    )

    unmount()
  })
})
