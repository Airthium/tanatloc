import { fireEvent, render, screen } from '@testing-library/react'
import { FormListFieldData } from 'antd'

import FormListItem from '..'

const field = { key: 1, name: 1 } as FormListFieldData
const remove = jest.fn()

describe('components/assets/form/list/list', () => {
  test('render', () => {
    const { unmount } = render(
      <FormListItem field={field} label="test" index={1} remove={remove}>
        <div />
        <div />
      </FormListItem>
    )

    unmount()
  })

  test('remove', () => {
    const { unmount } = render(
      <FormListItem field={field} label="test" index={1} remove={remove}>
        <div />
        <div />
      </FormListItem>
    )

    const button = screen.getByRole('img')
    fireEvent.click(button)

    expect(remove).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenLastCalledWith(1)

    unmount()
  })
})
