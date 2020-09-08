import { NavigationHelper } from '../NavigationHelper'

document.createElement = () => ({
  getContext: () => ({
    fillRect: () => {},
    fillText: () => {}
  })
})

document.addEventListener = (type, callback) => {
  callback({})
  callback({ clientX: 75, clientY: 75 })
  callback({ clientX: 50, clientY: 50 })
  callback({ clientX: 25, clientY: 25 })
}

describe('src/lib/three/helpers/NavigationHelper', () => {
  const renderer = {
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
    },
    setViewport: () => {},
    render: () => {}
  }
  const camera = {
    position: {
      copy: () => ({
        multiplyScalar: () => {}
      }),
      distanceTo: () => {}
    },
    up: {
      copy: () => {}
    }
  }
  const controls = {}

  it('call', () => {
    const navigation = NavigationHelper(renderer, camera, controls)
    expect(navigation).toBeDefined()
  })

  it('resize', () => {
    const navigation = NavigationHelper(renderer, camera, controls)
    navigation.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      newWidth: 0,
      newHeight: 0
    })
  })

  it('render', () => {
    const navigation = NavigationHelper(renderer, camera, controls)
    navigation.render()
  })
})
