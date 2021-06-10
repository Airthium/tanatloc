import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Selector from '@/components/assets/selector'

const mockType = jest.fn()
const mockHighlighted = jest.fn()
const mockSelected = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: (callback) =>
    callback({
      select: {
        type: mockType(),
        highlighted: mockHighlighted(),
        selected: mockSelected()
      }
    }),
  useDispatch: () => jest.fn()
}))

const mockHighlight = jest.fn()
const mockUnhighlight = jest.fn()
const mockSelect = jest.fn()
const mockUnselect = jest.fn()
jest.mock('@/store/select/action', () => ({
  highlight: () => mockHighlight(),
  unhighlight: () => mockUnhighlight(),
  select: () => mockSelect(),
  unselect: () => mockUnselect()
}))

jest.mock('@/lib/utils', () => ({
  stringToColor: jest.fn(),
  rgbToHex: jest.fn(),
  rgbToRgba: () => 'rgba()'
}))

describe('components/assets/selector', () => {
  const geometry = {
    faces: [
      {
        name: 'name',
        uuid: 'uuid',
        color: { r: 0, g: 0.5, b: 1 }
      },
      {
        uuid: 'uuid2'
      },
      {
        uuid: 'uuid3',
        color: { r: 0, g: 0.5, b: 1 }
      },
      {
        uuid: 'uuid4',
        color: { r: 0, g: 0.5, b: 0.5 }
      }
    ]
  }
  const alreadySelected = [
    {
      label: 'label',
      selected: [{ uuid: 'uuid' }]
    }
  ]
  const updateSelected = jest.fn()

  beforeEach(() => {
    mockType.mockReset()
    mockType.mockImplementation(() => 'faces')
    mockHighlighted.mockReset()
    mockSelected.mockReset()
    mockSelected.mockImplementation(() => [])

    mockHighlight.mockReset()
    mockUnhighlight.mockReset()
    mockSelect.mockReset()
    mockUnselect.mockReset()

    updateSelected.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    unmount()
  })

  test('empty render', () => {
    const { unmount } = render(
      <Selector
        geometry={{}}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    unmount()
  })

  test('on highlight unhighlight', () => {
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    const card = screen.getByText('name')
    fireEvent.mouseEnter(card)

    expect(mockHighlight).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(card)
    expect(mockUnhighlight).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('select', () => {
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    // Select
    const card = screen.getByText('name')
    fireEvent.click(card)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('unselect', () => {
    mockSelected.mockImplementation(() => ['uuid'])
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    // Unselect
    const card = screen.getByText('name')
    fireEvent.click(card)
    expect(mockUnselect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('color filter', () => {
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('color filter (selected)', () => {
    mockSelected.mockImplementation(() => ['uuid'])
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('already highlighted', () => {
    mockHighlighted.mockImplementation(() => 'uuid')
    const { unmount } = render(
      <Selector
        geometry={geometry}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    unmount()
  })
})
