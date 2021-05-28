import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryCondition from '@/components/project/simulation/boundaryConditions/boundaryCondition'

jest.mock('@/components/assets/formula', () => {
  const Formula = () => <div />
  return Formula
})

jest.mock('@/components/assets/selector', () => {
  const Selector = () => <div />
  return Selector
})

jest.mock('@/components/project/simulation/boundaryConditions/add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('@/components/project/simulation/boundaryConditions/edit', () => {
  const Edit = () => <div />
  return Edit
})

describe('components/project/simulation/boundaryConditions/boundaryCondition', () => {
  const simulation = {}
  const part = {}
  const boundaryConditions = {
    title: 'title',
    key: {
      label: 'label',
      children: [
        {
          default: 0
        }
      ],
      values: [{}]
    }
  }
  let boundaryCondition = undefined
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const close = jest.fn()

  beforeEach(() => {
    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={true}
        simulation={simulation}
        part={part}
        boundaryConditions={boundaryConditions}
        boundaryCondition={boundaryCondition}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  // // test('without boundaryConditions', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       visible={true}
  // //       simulation={simulation}
  // //       part={part}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )
  // //   expect(wrapper).toBeDefined()
  // // })

  // test('onName', () => {
  //   wrapper
  //     .find('Card')
  //     .at(0)
  //     .props()
  //     .children.props.onChange({ target: { value: 'name' } })
  // })

  // // test('onType', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )

  // //   act(() =>
  // //     wrapper
  // //       .find('Card')
  // //       .at(1)
  // //       .props()
  // //       .children.props.onChange({ target: { value: 'key' } })
  // //   )

  // //   // Without children
  // //   wrapper.unmount()
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       visible={true}
  // //       simulation={simulation}
  // //       part={part}
  // //       boundaryConditions={{
  // //         title: 'title',
  // //         key: {
  // //           label: 'label'
  // //         }
  // //       }}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )
  // //   act(() =>
  // //     wrapper
  // //       .find('Card')
  // //       .at(1)
  // //       .props()
  // //       .children.props.onChange({ target: { value: 'key' } })
  // //   )
  // // })

  // test('onSelected', () => {
  //   wrapper.find('Selector').props().updateSelected()
  // })

  // test('onClose', () => {
  //   wrapper.find('Add').props().close()
  //   expect(close).toHaveBeenCalledTimes(1)
  // })

  // test('edit', () => {
  //   wrapper.unmount()
  //   boundaryCondition = {}
  //   wrapper = shallow(
  //     <BoundaryCondition
  //       visible={true}
  //       simulation={simulation}
  //       part={part}
  //       boundaryConditions={boundaryConditions}
  //       boundaryCondition={boundaryCondition}
  //       swr={swr}
  //       close={close}
  //     />
  //   )
  //   expect(wrapper.find('Edit').length).toBe(1)
  // })

  // // test('effect', () => {
  // //   // With boundaryCondition
  // //   wrapper.unmount()
  // //   boundaryCondition = { selected: [{ uuid: 'uuid', label: 1 }] }
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )

  // //   // Without boundaryCondition
  // //   wrapper.unmount()
  // //   boundaryCondition = null
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )

  // //   // Enable
  // //   wrapper.unmount()
  // //   boundaryCondition = {
  // //     name: 'name',
  // //     selected: [{ uuid: 'uuid', label: 1 }],
  // //     values: [
  // //       {
  // //         value: 0
  // //       }
  // //     ]
  // //   }
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )
  // // })

  // // test('onValueChange', () => {
  // //   boundaryCondition = {
  // //     type: {
  // //       key: 'key',
  // //       children: [
  // //         {
  // //           default: 1
  // //         }
  // //       ]
  // //     },
  // //     name: 'name',
  // //     selected: [{ uuid: 'uuid', label: 1 }],
  // //     values: [{}]
  // //   }
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       close={close}
  // //       swr={swr}
  // //     />
  // //   )
  // //   act(() => wrapper.find('Formula').props().onValueChange(0, 10))
  // // })

  // // test('onCheckedChange', () => {
  // //   boundaryCondition = {
  // //     type: {
  // //       key: 'key',
  // //       children: [
  // //         {
  // //           default: 1
  // //         },
  // //         {
  // //           default: 0
  // //         }
  // //       ]
  // //     },
  // //     name: 'name',
  // //     selected: [{ uuid: 'uuid', label: 1 }],
  // //     values: [
  // //       {
  // //         checked: true,
  // //         value: 0
  // //       },
  // //       {
  // //         hecked: false,
  // //         value: 0
  // //       }
  // //     ]
  // //   }
  // //   wrapper = mount(
  // //     <BoundaryCondition
  // //       simulation={simulation}
  // //       visible={true}
  // //       part={part}
  // //       boundaryConditions={boundaryConditions}
  // //       boundaryCondition={boundaryCondition}
  // //       swr={swr}
  // //       close={close}
  // //     />
  // //   )
  // //   act(() => wrapper.find('Formula').at(1).props().onCheckedChange(1, true))
  // // })
})
