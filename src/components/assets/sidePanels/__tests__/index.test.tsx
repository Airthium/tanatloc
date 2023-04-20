import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import SidePanels from '..'

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => callback()
})

describe('components/assets/sidePanels', () => {
  const leftChild = <div />
  const rightChild = <div />

  test('render', () => {
    const { unmount } = render(
      <SidePanels leftChild={leftChild} rightChild={rightChild} />
    )

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(
      <SidePanels leftChild={leftChild} rightChild={rightChild} />
    )

    fireEvent.resize(window)

    unmount()
  })

  test('mousemove', () => {
    const { unmount } = render(
      <SidePanels leftChild={leftChild} rightChild={rightChild} />
    )

    fireEvent.mouseMove(window)

    unmount()
  })

  test('divider', () => {
    // jest.spyOn(React, 'useRef').mockImplementation(() => ({
    //   current: {
    //     getBoundingClientRect: () => ({
    //       left: 0,
    //       width: 500
    //     })
    //   }
    // }))
    const { unmount } = render(
      <SidePanels leftChild={leftChild} rightChild={rightChild} />
    )

    const divider = screen.getByRole('Divider')
    fireEvent.mouseDown(divider)

    fireEvent.mouseMove(window, { clientX: 100 })
    fireEvent.mouseMove(window, { clientX: -100 })

    fireEvent.mouseUp(window)

    unmount()
  })
})
