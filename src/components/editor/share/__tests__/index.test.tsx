import { render } from '@testing-library/react'

import { IFrontOrganizationsItem, IFrontUserModel } from '@/api/index.d'

import Share from '..'

jest.mock('@/components/assets/share', () => () => <div />)

describe('components/editor/share', () => {
  const user = { usermodels: [] }
  const organizations: IFrontOrganizationsItem[] = []
  const mutateUser = async () => {
    jest.fn()
  }
  const swr = { mutateUser }

  test('render', () => {
    const { unmount } = render(
      <Share user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  test('id', () => {
    const { unmount } = render(
      <Share
        user={{ usermodels: [{ id: 'id' } as IFrontUserModel] }}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })
})
