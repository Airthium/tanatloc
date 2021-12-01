import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Configuration from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockGeometry = jest.fn()
jest.mock('../geometry', () => (props) => mockGeometry(props))

const mockMaterial = jest.fn()
jest.mock('../material', () => (props) => mockMaterial(props))

const mockParameters = jest.fn()
jest.mock('../parameters', () => (props) => mockParameters(props))

const mockBoundaryCondition = jest.fn()
jest.mock('../boundaryCondition', () => (props) => mockBoundaryCondition(props))

const mockInitialization = jest.fn()
jest.mock('../initialization', () => (props) => mockInitialization(props))

const mockResults = jest.fn()
jest.mock('../results', () => (props) => mockResults(props))

describe('components/editor/configuration', () => {
  const configuration = {
    parameters: {}
  }
  const onNext = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockGeometry.mockReset()
    mockGeometry.mockImplementation(() => <div />)

    mockMaterial.mockReset()
    mockMaterial.mockImplementation(() => <div />)

    mockParameters.mockReset()
    mockParameters.mockImplementation(() => <div />)

    mockBoundaryCondition.mockReset()
    mockBoundaryCondition.mockImplementation(() => <div />)

    mockInitialization.mockReset()
    mockInitialization.mockImplementation(() => <div />)

    mockResults.mockReset()
    mockResults.mockImplementation(() => <div />)

    onNext.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    unmount()
  })

  test('geometry', () => {
    mockGeometry.mockImplementation((props) => (
      <div
        role="Geometry"
        onClick={() =>
          props.onOk({
            meshable: true,
            name: 'name'
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Geometry' })
    fireEvent.click(button)

    // On ok
    const geometry = screen.getByRole('Geometry')
    fireEvent.click(geometry)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('geometry, no meshable', () => {
    mockGeometry.mockImplementation((props) => (
      <div
        role="Geometry"
        onClick={() =>
          props.onOk({
            meshable: false,
            name: 'name'
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Geometry' })
    fireEvent.click(button)

    // On ok
    const geometry = screen.getByRole('Geometry')
    fireEvent.click(geometry)

    unmount()
  })

  test('material', () => {
    mockMaterial.mockImplementation((props) => (
      <div
        role="Material"
        onClick={() =>
          props.onOk({
            label: 'Material',
            symbol: 'M',
            default: 1,
            unit: '$U$'
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Material parameters' })
    fireEvent.click(button)

    // On ok
    const material = screen.getByRole('Material')
    fireEvent.click(material)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('material edit', () => {
    let index = undefined
    mockMaterial.mockImplementation((props) => (
      <div
        role="Material"
        onClick={() =>
          props.onOk({
            index,
            label: 'Material',
            symbol: 'M',
            default: 1,
            unit: '$U$'
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Material parameters' })
    fireEvent.click(button)

    // On ok
    const material = screen.getByRole('Material')
    fireEvent.click(material)

    // Edit
    index = 0
    fireEvent.click(button)
    fireEvent.click(material)

    unmount()
  })

  test('parameters', () => {
    mockParameters.mockImplementation((props) => (
      <div
        role="Parameters"
        onClick={() => {
          try {
            props.onOk({
              label: 'Parameters',
              parameters: [
                {
                  label: 'Parameter',
                  default: 1,
                  unit: '$U$'
                }
              ]
            })
          } catch (err) {
            console.error(err)
          }
        }}
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Physical parameters' })
    fireEvent.click(button)

    // On ok
    const parameters = screen.getByRole('Parameters')
    fireEvent.click(parameters)
    fireEvent.click(parameters)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('initialization', () => {
    mockInitialization.mockImplementation((props) => (
      <div
        role="Initialization"
        onClick={() => {
          try {
            props.onOk({
              children: [
                {
                  label: 'label'
                }
              ],
              compatibility: [
                {
                  algorithm: 'algorithm'
                }
              ]
            })
          } catch (err) {
            console.error(err)
          }
        }}
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Initialization' })
    fireEvent.click(button)

    // On ok
    const initialization = screen.getByRole('Initialization')
    fireEvent.click(initialization)
    fireEvent.click(initialization)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('boundaryCondition', () => {
    mockBoundaryCondition.mockImplementation((props) => (
      <div
        role="BoundaryCondition"
        onClick={() => {
          try {
            props.onOk({
              inputs: [{}]
            })
          } catch (err) {
            console.error(err)
          }
        }}
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Boundary conditions' })
    fireEvent.click(button)

    // On ok
    const boundaryCondition = screen.getByRole('BoundaryCondition')
    fireEvent.click(boundaryCondition)
    fireEvent.click(boundaryCondition)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('results', () => {
    mockResults.mockImplementation((props) => (
      <div
        role="Results"
        onClick={() =>
          props.onOk({
            fields: [{ name: 'field' }],
            filter: [{ name: 'name' }]
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Results' })
    fireEvent.click(button)

    // On ok
    const results = screen.getByRole('Results')
    fireEvent.click(results)

    // Edit
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    // Delete
    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    unmount()
  })

  test('results, without filter', () => {
    mockResults.mockImplementation((props) => (
      <div
        role="Results"
        onClick={() =>
          props.onOk({
            fields: [{ name: 'field' }]
          })
        }
      />
    ))

    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    // Open
    const button = screen.getByRole('button', { name: 'Results' })
    fireEvent.click(button)

    // On ok
    const results = screen.getByRole('Results')
    fireEvent.click(results)

    unmount()
  })

  test('submit', () => {
    const { unmount } = render(
      <Configuration configuration={configuration} onNext={onNext} />
    )

    const form = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(form)

    unmount()
  })
})
