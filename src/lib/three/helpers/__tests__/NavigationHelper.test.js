import { NavigationHelper } from '../NavigationHelper'

document.createElement = () => ({
  getContext: () => ({
    fillRect: () => {},
    fillText: () => {}
  })
})

describe('src/lib/three/helpers/NavigationHelper', () => {
  it('call', () => {
    const navigation = NavigationHelper()
    expect(navigation).toBeDefined()
  })
})
