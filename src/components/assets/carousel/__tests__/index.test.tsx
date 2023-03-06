import { fireEvent, render, screen } from '@testing-library/react'

import Carousel from '..'

//@ts-ignore
global.setTimeout = (callback: Function) => callback()

describe('components/assets/carousel', () => {
  const oneItem = {
    key: 'key',
    src: '',
    caption: 'caption'
  }
  const multipleItems = [
    { key: 'key1', src: '', alt: 'alt', caption: 'caption' },
    { key: 'key2', src: '' }
  ]

  test('render', () => {
    const { unmount } = render(<Carousel items={[oneItem]} />)

    unmount()
  })

  test('multiple items', () => {
    const { unmount } = render(<Carousel items={multipleItems} />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(<Carousel items={multipleItems} />)

    const left = screen.getByRole('button', { name: 'left' })
    const right = screen.getByRole('button', { name: 'right' })
    const zoomIn = screen.getByRole('button', { name: 'zoom-in' })

    fireEvent.click(left)
    fireEvent.click(right)

    fireEvent.click(zoomIn)

    const zoomOut = screen.getByRole('button', { name: 'zoom-out' })
    fireEvent.click(zoomOut)

    unmount()
  })
})
