import { fireEvent, render, screen } from '@testing-library/react'

import Workspace from '..'

jest.mock('@/components/assets/carousel', () => () => <div />)
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => <div role="Button" onClick={props.onAdd} />,
  DeleteButton: (props: any) => <div role="Button" onClick={props.onDelete} />,
  EditButton: (props: any) => <div role="Button" onClick={props.onEdit} />
}))

describe('components/doc/dashboard/workspace', () => {
  test('render', () => {
    const { unmount } = render(<Workspace />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Workspace />)

    const buttons = screen.getAllByRole('Button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })
})
