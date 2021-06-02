import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Formula from '@/components/assets/formula'

const onValueChange = jest.fn()
const onCheckedChange = jest.fn()

global.setTimeout = (callback) => {
  callback()
  return 1
}

describe('components/assets/formula', () => {
  beforeEach(() => {
    onValueChange.mockReset()
    onCheckedChange.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Formula defaultValue="value" onValueChange={onValueChange} />
    )

    unmount()
  })

  test('with checkbox', () => {
    const { unmount } = render(
      <Formula
        defaultValue="value"
        defaultChecked={false}
        onValueChange={onValueChange}
        onCheckedChange={onCheckedChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    unmount()
  })

  test('input change', () => {
    const { unmount } = render(
      <Formula defaultValue="value" onValueChange={onValueChange} />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    unmount()
  })

  // test('onCheckboxChange', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Formula
  //       defaultValue="value"
  //       defaultChecked={true}
  //       onValueChange={onValueChange}
  //       onCheckedChange={onCheckedChange}
  //     />
  //   )

  //   let checked
  //   onCheckedChange.mockImplementation((val) => (checked = val))

  //   wrapper
  //     .find('Checkbox')
  //     .props()
  //     .onChange({
  //       target: {
  //         checked: true
  //       }
  //     })
  //   expect(onCheckedChange).toHaveBeenCalledTimes(1)
  //   expect(checked).toBe(true)
  // })

  // test('onInputChange', () => {
  //   let value
  //   onValueChange.mockImplementation((val) => (value = val))
  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'newValue'
  //       }
  //     })
  //   expect(onValueChange).toHaveBeenCalledTimes(1)
  //   expect(value).toBe('newValue')

  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'newValue'
  //       }
  //     })
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()

  // //   wrapper = mount(<Formula value="value" onChange={() => {}} />)
  // // })
})
