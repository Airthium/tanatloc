import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Editor from '..'

const mockInformation = jest.fn()
jest.mock('../information', () => (props) => mockInformation(props))

const mockConfiguration = jest.fn()
jest.mock('../configuration', () => (props) => mockConfiguration(props))

const mockScript = jest.fn()
jest.mock('../script', () => (props) => mockScript(props))

describe('components/editor', () => {
  beforeEach(() => {
    mockInformation.mockReset()
    mockInformation.mockImplementation(() => <div />)

    mockConfiguration.mockReset()
    mockConfiguration.mockImplementation(() => <div />)

    mockScript.mockReset()
    mockScript.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Editor />)

    unmount()
  })

  test('steps', () => {
    const { unmount } = render(<Editor />)

    const information = screen.getByRole('button', {
      name: '1 Information Title, description, category, ...'
    })
    fireEvent.click(information)

    const configuration = screen.getByRole('button', {
      name: '2 Configuration Geometry, parameters, ...'
    })
    fireEvent.click(configuration)

    const script = screen.getByRole('button', {
      name: '3 Script FreeFEM template'
    })
    fireEvent.click(script)

    unmount()
  })

  test('information', () => {
    mockInformation.mockImplementation((props) => (
      <div
        role="Information"
        onClick={() =>
          props.onNext({
            name: 'name',
            category: 'category',
            description: 'description'
          })
        }
      />
    ))

    const { unmount } = render(<Editor />)

    const information = screen.getByRole('Information')
    fireEvent.click(information)

    unmount()
  })

  test('configuration', () => {
    mockInformation.mockImplementation((props) => (
      <div role="Information" onClick={() => props.onNext({})} />
    ))
    mockConfiguration.mockImplementation((props) => (
      <div role="Configuration" onClick={() => props.onNext({})} />
    ))

    const { unmount } = render(<Editor />)

    const information = screen.getByRole('Information')
    fireEvent.click(information)

    const configuration = screen.getByRole('Configuration')
    fireEvent.click(configuration)

    unmount()
  })
})
