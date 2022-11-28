import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontGeometriesItem } from '@/api/index.d'

import { SelectContext } from '@/context/select'

import Selector from '@/components/assets/selector'

const mockHighlight = jest.fn()
const mockUnhighlight = jest.fn()
const mockSelect = jest.fn()
const mockUnselect = jest.fn()
jest.mock('@/context/select/actions', () => ({
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
    summary: {
      faces: [
        {
          name: 'name',
          uuid: 'uuid',
          label: 1,
          color: { r: 0, g: 0, b: 1 }
        },
        {
          name: 'name2',
          uuid: 'uuid2',
          label: 2,
          color: { r: 0, g: 0, b: 1 }
        },
        {
          name: 'name3',
          uuid: 'uuid3',
          label: 3,
          color: { r: 1, g: 0, b: 1 }
        },
        {
          name: 'name4',
          uuid: 'uuid4',
          label: 4
        }
      ]
    }
  } as Pick<IFrontGeometriesItem, 'summary'>
  const alreadySelected = [
    {
      label: 'label',
      selected: [{ uuid: 'uuid', label: 1 }]
    }
  ]
  const updateSelected = jest.fn()

  beforeEach(() => {
    mockHighlight.mockReset()
    mockUnhighlight.mockReset()
    mockSelect.mockReset()
    mockUnselect.mockReset()

    updateSelected.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('without type', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: undefined,
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('on highlight unhighlight', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
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
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    // Select
    const card = screen.getByText('name')
    fireEvent.click(card)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('unselect', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [{ uuid: 'uuid', label: 1 }],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    // Unselect
    const card = screen.getByText('name')
    fireEvent.click(card)
    expect(mockUnselect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('color filter', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('color filter (selected)', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [{ uuid: 'uuid3', label: 3 }],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('search', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'search' } })

    unmount()
  })

  test('already highlighted', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          type: 'faces',
          highlighted: { uuid: 'uuid', label: 1 },
          selected: [],
          dispatch: jest.fn()
        }}
      >
        <Selector
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={updateSelected}
        />
      </SelectContext.Provider>
    )

    unmount()
  })
})
