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
  const part = {
    faces: [
      {
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
        part={part}
        alreadySelected={alreadySelected}
        updateSelected={updateSelected}
      />
    )

    unmount()
  })

  // test('empty render', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(<Selector part={{}} updateSelected={updateSelected} />)
  //   expect(wrapper).toBeDefined()
  // })

  // test('onHighlight', () => {
  //   wrapper.find('Card').at(1).props().onMouseEnter('uuid')
  //   expect(mockHighlight).toHaveBeenCalledTimes(1)
  // })

  // test('onUnhighlight', () => {
  //   wrapper.find('Card').at(1).props().onMouseLeave()
  //   expect(mockUnhighlight).toHaveBeenCalledTimes(1)
  // })

  // test('onSelect', () => {
  //   // Select
  //   wrapper.find('Card').at(1).props().onClick('uuid')
  //   expect(mockSelect).toHaveBeenCalledTimes(1)

  //   // Unselect
  //   wrapper.unmount()
  //   mockSelected.mockImplementation(() => ['uuid'])
  //   wrapper = shallow(<Selector part={part} updateSelected={updateSelected} />)
  //   wrapper.find('Card').at(1).props().onClick('uuid')
  //   expect(mockUnselect).toHaveBeenCalledTimes(1)
  // })

  // // test('onColorFilter', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)
  // //   act(() => wrapper.find('Button').at(0).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(1).props().onClick())
  // //   wrapper.update()
  // // })

  // // test('selectAll', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)

  // //   act(() => wrapper.find('Button').at(3).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(1).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(3).props().onClick())
  // //   wrapper.update()
  // // })

  // // test('unselectAll', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)

  // //   act(() => wrapper.find('Button').at(4).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(1).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(4).props().onClick())
  // //   wrapper.update()
  // // })

  // // test('selectSwap', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)

  // //   act(() => wrapper.find('Button').at(5).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(1).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(5).props().onClick())
  // //   wrapper.update()

  // //   wrapper.unmount()
  // //   mockSelected.mockImplementation(() => ['uuid'])
  // //   wrapper = mount(<Selector part={part} updateSelected={updateSelected} />)

  // //   act(() => wrapper.find('Button').at(5).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(1).props().onClick())
  // //   wrapper.update()

  // //   act(() => wrapper.find('Button').at(5).props().onClick())
  // //   wrapper.update()
  // // })

  // test('face highlighted', () => {
  //   wrapper.unmount()
  //   mockHighlighted.mockImplementation(() => 'uuid')
  //   wrapper = shallow(<Selector part={part} updateSelected={updateSelected} />)
  //   expect(wrapper.find('div').at(0).props().style.backgroundColor).toBe(
  //     '#0096C7'
  //   )
  // })
})
