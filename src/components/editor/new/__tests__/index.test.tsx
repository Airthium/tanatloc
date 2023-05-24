import { fireEvent, render, screen } from '@testing-library/react'
import New from '..'

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Modal: {
    confirm: (props: any) => {
      props.onOk()
      return <div />
    }
  }
}))

describe('component/editor/new', () => {
  test('render', () => {
    const { unmount } = render(<New />)

    unmount()
  })

  test('onNew', () => {
    const { unmount } = render(<New />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
