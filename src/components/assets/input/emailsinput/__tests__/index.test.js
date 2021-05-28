import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import EmailsInput from '..'

describe('components/assets/input/emailsinput', () => {
  const onChange = jest.fn()

  test('render', () => {
    const { unmount } = render(<EmailsInput onChange={onChange} />)

    unmount()
  })

  // test('onChange', () => {
  //   // Without email nor lastChar
  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'value'
  //       }
  //     })
  //   expect(wrapper.find('Input').props().value).toBe('value')

  //   // Without email
  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'value '
  //       }
  //     })
  //   expect(wrapper.find('Input').props().value).toBe('value ')

  //   // With emails
  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'value mail@domain.com '
  //       }
  //     })
  //   expect(wrapper.find('Input').props().value).toBe('value ')
  //   expect(wrapper.find('Tag').length).toBe(1)
  // })

  // test('onClose', () => {
  //   // Add an email
  //   wrapper
  //     .find('Input')
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'mail@domain.com '
  //       }
  //     })

  //   // Close
  //   wrapper.find('Tag').props().onClose()
  //   expect(wrapper.find('Tag').length).toBe(0)
  // })

  // // test('effect', () => {
  // //   // Without values
  // //   wrapper.unmount()
  // //   wrapper = mount(<EmailsInput onChange={onChange} />)

  // //   // With values
  // //   wrapper.unmount()
  // //   wrapper = mount(<EmailsInput values={[]} onChange={onChange} />)
  // // })
})
