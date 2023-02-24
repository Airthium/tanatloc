import { css } from '@emotion/react'
import { render, screen } from '@testing-library/react'

import Side from '..'

describe('components/assets/side', () => {
  const left = <>left</>
  const right = <>right</>
  const top = <>top</>

  test('render', () => {
    const { unmount } = render(<Side left={left} right={right} />)

    screen.getByText('left')
    screen.getByText('right')

    unmount()
  })

  test('render with top', () => {
    const { unmount } = render(<Side left={left} right={right} top={top} />)

    screen.getByText('left')
    screen.getByText('right')
    screen.getByText('top')

    unmount()
  })

  test('render with css & id', () => {
    const { unmount } = render(
      <Side
        left={left}
        right={right}
        top={top}
        sideClassName="className"
        leftClassName="className"
        rightClassName="className"
        topClassName="className"
        id="id"
      />
    )

    screen.getByText('left')
    screen.getByText('right')
    screen.getByText('top')

    unmount()
  })
})
