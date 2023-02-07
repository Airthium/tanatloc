import { fireEvent, render, screen } from '@testing-library/react'

import Organizations from '..'

jest.mock('@/components/assets/carousel', () => () => <div />)
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => <div role="Button" onClick={props.onAdd} />
}))

describe('components/doc/dashboard/organizations', () => {
  test('render', () => {
    const { unmount } = render(<Organizations />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(<Organizations />)

    const buttons = screen.getAllByRole('Button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })
})
