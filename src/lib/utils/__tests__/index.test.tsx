import { render, screen } from '@testing-library/react'

import Utils from '../'

describe('lib/utils', () => {
  test('stringToColor', () => {
    let color

    // Empty
    color = Utils.stringToColor()
    expect(color).toBe('#FFFFFF')

    // With string
    color = Utils.stringToColor('string')
    expect(color).toBe('#D56011')
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

  test('userToAvatar', () => {
    let res

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
  })

  test('groupToAvatar', () => {
    let res

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
    let res = Utils.validateEmail('email')
    expect(res).toBe(false)

    res = Utils.validateEmail('email@email.email')
    expect(res).toBe(true)
  })
})