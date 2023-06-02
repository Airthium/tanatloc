import { render } from '@testing-library/react'

import { IFrontOrganizationsItem, IFrontUserModel } from '@/api/index.d'

import { EditorContext } from '@/context/editor'

import Share from '..'

jest.mock('@/components/assets/share', () => () => <div />)

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

describe('components/editor/share', () => {
  const user = { id: 'id', usermodels: [] }
  const organizations: IFrontOrganizationsItem[] = []
  const mutateUser = async () => {
    jest.fn()
  }
  const swr = { mutateUser }

  beforeEach(() => {
    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(
      <Share user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  test('electron', () => {
    mockIsElectron.mockImplementation(() => true)
    const { unmount } = render(
      <Share user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  test('id', () => {
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
        <Share
          user={{
            id: 'id',
            usermodels: [
              { id: 'id', owners: [{ id: 'id' }] } as IFrontUserModel
            ]
          }}
          organizations={organizations}
          swr={swr}
        />
      </EditorContext.Provider>
    )

    unmount()
  })

  test('id1', () => {
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
        <Share
          user={{
            id: 'id',
            usermodels: [
              { id: 'id', owners: [{ id: 'id1' }] } as IFrontUserModel
            ]
          }}
          organizations={organizations}
          swr={swr}
        />
      </EditorContext.Provider>
    )

    unmount()
  })
})
