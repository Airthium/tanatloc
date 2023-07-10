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
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          left: 0,
          width: 500
        }) as DOMRect
    )

    const { unmount } = render(
      <SidePanels leftChild={leftChild} rightChild={rightChild} />
    )

    const divider = screen.getByRole('Divider')
    fireEvent.mouseDown(divider)

    fireEvent.mouseMove(window, { clientX: 25 })
    fireEvent.mouseMove(window, { clientX: 250 })
    fireEvent.mouseMove(window, { clientX: 475 })

    fireEvent.mouseUp(window)

    unmount()
  })
})
