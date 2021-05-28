import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Materials from '@/components/project/simulation/materials'

jest.mock('@/components/assets/button', () => ({
  AddButton: 'AddButton'
}))

jest.mock('@/components/project/simulation/materials/list', () => 'List')
jest.mock(
  '@/components/project/simulation/materials/material',
  () => 'Material'
)

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSetType = jest.fn()
const mockSetPart = jest.fn()
jest.mock('@/store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  setType: () => mockSetType(),
  setPart: () => mockSetPart()
}))

describe('components/project/simulation/materials', () => {
  const project = {}
  const simulation = {
    scheme: {
      configuration: {
        materials: {
          index: 1,
          label: 'label',
          values: [{}]
        }
      }
    }
  }
  const part = {}
  const setVisible = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSetType.mockReset()
    mockSetPart.mockReset()

    setVisible.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Materials
        project={project}
        simulation={simulation}
        part={part}
        setVisible={setVisible}
      />
    )

    unmount()
  })

  // test('onAdd', () => {
  //   wrapper.find('AddButton').props().onAdd()
  //   expect(mockEnable).toHaveBeenCalledTimes(1)
  // })

  // test('onEdit', () => {
  //   wrapper.find('List').props().onEdit()
  // })

  // test('onClose', () => {
  //   wrapper.find('Material').props().close()
  //   expect(mockDisable).toHaveBeenCalledTimes(1)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Materials
  // //       project={project}
  // //       simulation={simulation}
  // //       part={part}
  // //       setVisible={setVisible}
  // //     />
  // //   )
  // //   expect(mockSetType).toHaveBeenCalledTimes(1)
  // //   expect(mockSetPart).toHaveBeenCalledTimes(1)

  // //   // Without part
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <Materials
  // //       project={project}
  // //       simulation={simulation}
  // //       setVisible={setVisible}
  // //     />
  // //   )
  // // })
})
