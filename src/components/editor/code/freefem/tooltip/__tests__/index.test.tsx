import { render } from '@testing-library/react'

import CustomTooltip from '..'

describe('components/editor/code/freefem/tooltip', () => {
  test('render', () => {
    const { unmount } = render(<CustomTooltip x={0} y={0} />)

    unmount()
  })

  test('width, height, x, y', () => {
    jest
      .spyOn(document, 'querySelector')
      .mockImplementation(
        () => ({ offsetWidth: 10, offsetHeight: 10 }) as unknown as Element
      )

    const { rerender, unmount } = render(<CustomTooltip x={4} y={4} />)

    rerender(<CustomTooltip x={6} y={6} />)

    jest.spyOn(document, 'querySelector').mockReset()

    unmount()
  })

  test('token', () => {
    const { unmount } = render(
      <CustomTooltip
        x={6}
        y={6}
        token={{
          name: 'token',
          definition: 'description',
          example: 'example\n\n',
          params: ['param', 'param'],
          output: ['output', 'output']
        }}
      />
    )

    unmount()
  })

  test('token docReference', () => {
    const { unmount } = render(
      <CustomTooltip
        x={6}
        y={6}
        token={{
          name: 'token',
          definition: 'description',
          example: 'example\n\n',
          params: ['param', 'param'],
          output: ['output', 'output'],
          docReference: 'url'
        }}
      />
    )

    unmount()
  })
})
