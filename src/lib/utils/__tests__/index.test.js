import { shallow } from 'enzyme'

import Utils from '../'

describe('lib/utils', () => {
  it('stringToColor', () => {
    let color

    // Empty
    color = Utils.stringToColor()
    expect(color).toBe('#FFFFFF')

    // With string
    color = Utils.stringToColor('string')
    expect(color).toBe('#D56011')
  })

  it('rgbToHex', () => {
    const hex = Utils.rgbToHex({ r: 0, g: 1, b: 1 })
    expect(hex).toBe('#00ffff')
  })

  it('rgbToRgba', () => {
    let rgba = Utils.rgbToRgba({ r: 0, g: 1, b: 1 }, 0.1)
    expect(rgba).toBe('rgba(0, 255, 255, 0.1)')

    rgba = Utils.rgbToRgba()
    expect(rgba).toBe('rgba(255, 255, 255, 0)')
  })

  it('userToAvatar', () => {
    let res, wrapper

    // Empty
    res = Utils.userToAvatar({})
    wrapper = shallow(res)
    expect(wrapper.find('Spin').length).toBe(1)
    wrapper.unmount()

    // With avatar & email
    res = Utils.userToAvatar({
      avatar: { type: 'Buffer', data: ['data'] },
      email: 'email'
    })
    wrapper = shallow(res)
    expect(wrapper.find('Avatar').props().children).toBe('E')
    wrapper.unmount()

    // With firstname & lastname
    res = Utils.userToAvatar({
      email: 'email',
      firstname: 'firstname',
      lastname: 'lastname'
    })
    wrapper = shallow(res)
    expect(wrapper.find('Avatar').props().children).toBe('FL')
    wrapper.unmount()
  })

  it('groupToAvatar', () => {
    let res, wrapper

    // Empty
    res = Utils.groupToAvatar({})
    wrapper = shallow(res)
    expect(wrapper.find('Spin').length).toBe(1)
    wrapper.unmount()

    // With name
    res = Utils.groupToAvatar({ name: 'name' })
    wrapper = shallow(res)
    expect(wrapper.find('Avatar').props().children).toBe('N')
    wrapper.unmount()
  })
})
