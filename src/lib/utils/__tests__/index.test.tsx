import { render, screen } from '@testing-library/react'

import { IModel } from '@/models/index.d'

import Utils from '../'

const mockEmail = jest.fn()
jest.mock('email-addresses', () => ({
  parseOneAddress: () => mockEmail()
}))

describe('lib/utils', () => {
  beforeEach(() => {
    mockEmail.mockReset()
  })

  test('deepCopy', () => {
    const copy = Utils.deepCopy({})
    expect(copy).toEqual({})
  })

  test('stringToColor', () => {
    let color: any

    // Empty
    color = Utils.stringToColor()
    expect(color).toBe('#FFFFFF')

    // With string
    color = Utils.stringToColor('string')
    expect(color).toBe('hsl(-223, 100%, 25%)')
  })

  test('rgbToHex', () => {
    const hex = Utils.rgbToHex({ r: 0, g: 1, b: 1 })
    expect(hex).toBe('#00ffff')
  })

  test('rgbToRgba', () => {
    let rgba = Utils.rgbToRgba({ r: 0, g: 1, b: 1 }, 0.1)
    expect(rgba).toBe('rgba(0, 255, 255, 0.1)')

    rgba = Utils.rgbToRgba()
    expect(rgba).toBe('rgba(255, 255, 255, 0)')
  })

  test('colorGenerator', () => {
    let color: string | string[]

    color = Utils.colorGenerator()
    expect(color[0]).toBe('#')

    color = Utils.colorGenerator(2)
    expect(color[0][0]).toBe('#')
    expect(color[1][0]).toBe('#')
  })

  test('userToAvatar', () => {
    let res: any

    // Empty
    res = Utils.userToAvatar({})
    {
      const { unmount } = render(res)
      unmount()
    }

    // With avatar & email
    res = Utils.userToAvatar({
      avatar: Buffer.from('buffer'),
      email: 'email'
    })
    {
      const { unmount } = render(res)
      expect(screen.getByRole('img'))
      unmount()
    }

    // With firstname
    res = Utils.userToAvatar({
      email: 'email',
      firstname: 'firstname'
    })
    {
      const { unmount } = render(res)
      expect(screen.getByText('F'))
      unmount()
    }

    // With lastname
    res = Utils.userToAvatar({
      email: 'email',
      lastname: 'lastname'
    })
    {
      const { unmount } = render(res)
      expect(screen.getByText('L'))
      unmount()
    }

    // With firstname & lastname
    res = Utils.userToAvatar({
      email: 'email',
      firstname: 'firstname',
      lastname: 'lastname'
    })
    {
      const { unmount } = render(res)
      expect(screen.getByText('FL'))
      unmount()
    }

    // Pending
    res = Utils.userToAvatar({
      email: 'email',
      firstname: 'firstname',
      lastname: 'lastname',
      pending: true
    })
    {
      const { unmount } = render(res)
      expect(screen.getByText('FL'))
      unmount()
    }
  })

  test('workspaceToAvatar', () => {
    let res: any

    res = Utils.workspaceToAvatar({})
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.workspaceToAvatar({ id: 'id' })
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.workspaceToAvatar({ id: 'id', name: 'name' })
    {
      const { unmount } = render(res)
      unmount()
    }
  })

  test('projectToAvatar', () => {
    let res: any

    res = Utils.projectToAvatar({})
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.projectToAvatar({ id: 'id' })
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.projectToAvatar({ id: 'id', title: 'title' })
    {
      const { unmount } = render(res)
      unmount()
    }
  })

  test('usermodelToAvatar', () => {
    let res: any

    res = Utils.usermodelToAvatar({})
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.usermodelToAvatar({ id: 'id' })
    {
      const { unmount } = render(res)
      unmount()
    }

    res = Utils.usermodelToAvatar({
      id: 'id',
      model: { name: 'name' } as IModel
    })
    {
      const { unmount } = render(res)
      unmount()
    }
  })

  test('groupToAvatar', () => {
    let res: any

    // Empty
    res = Utils.groupToAvatar({})
    {
      const { unmount } = render(res)
      unmount()
    }

    // With name
    res = Utils.groupToAvatar({ id: 'id', name: 'name' })
    {
      const { unmount } = render(res)
      expect(screen.getByText('N'))
      unmount()
    }
  })

  test('vaidateEmail', () => {
    mockEmail.mockImplementation(() => null)
    let res = Utils.validateEmail('email')
    expect(res).toBe(false)

    mockEmail.mockImplementation(() => ({}))
    res = Utils.validateEmail('email@email.com')
    expect(res).toBe(true)
  })

  test('getGitVersion', () => {
    let res: string

    // Empty
    res = Utils.getGitVersion()
    expect(res).toBe('')

    // branch + hash
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_BRANCH', {
      value: 'dev'
    })
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_COMMIT', {
      value: 'hash'
    })
    res = Utils.getGitVersion()
    expect(res).toBe('git-dev-hash')
  })
})
