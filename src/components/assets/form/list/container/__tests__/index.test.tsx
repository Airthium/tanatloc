import { fireEvent, render, screen } from '@testing-library/react'

import FormListContainer from '..'

const add = jest.fn()

describe('components/assets/form/list/container', () => {
  test('render', () => {
    const { unmount } = render(
      <FormListContainer label="test" errors={[]} add={add}>
        <div />
        <div />
      </FormListContainer>
    )

    unmount()
  })

  test('add', () => {
    const { unmount } = render(
      <FormListContainer label="test" errors={[]} add={add}>
        <div />
        <div />
      </FormListContainer>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(add).toHaveBeenCalledTimes(1)

    unmount()
  })
})
