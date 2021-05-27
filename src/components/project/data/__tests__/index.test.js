import Data from '..'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('@/lib/utils', () => ({
  stringToColor: () => {}
}))

const mockSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  useSimulation: () => [mockSimulation()]
}))

let wrapper
describe('components/project/data', () => {
  const simulation = { id: 'id' }

  beforeEach(() => {
    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({}))

    wrapper = shallow(<Data simulation={simulation} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('setVisible', () => {
    wrapper.find('Button').at(0).props().onClick()
    expect(wrapper.find('DrawerWrapper').props().visible).toBe(true)

    wrapper.find('DrawerWrapper').props().onClose()
    expect(wrapper.find('DrawerWrapper').props().visible).toBe(false)
  })

  // test('without data', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<Data simulation={simulation} />)
  //   expect(wrapper).toBeDefined()
  // })

  // test('with data', () => {
  //   wrapper.unmount()
  //   mockSimulation.mockImplementation(() => ({
  //     tasks: [
  //       {
  //         datas: [
  //           {
  //             name: 'data name',
  //             x: 0,
  //             y: 0
  //           },
  //           {
  //             name: 'data name',
  //             x: 1,
  //             y: 1
  //           },
  //           {
  //             name: 'data name 2',
  //             x: 0,
  //             y: 0
  //           },
  //           {
  //             name: 'data name 2',
  //             x: 2,
  //             y: 2
  //           }
  //         ]
  //       },
  //       {}
  //     ]
  //   }))

  //   wrapper = mount(<Data simulation={simulation} />)
  //   expect(wrapper).toBeDefined()

  //   // Open drawer
  //   act(() => wrapper.find('Button').at(0).props().onClick())
  //   wrapper.update()

  //   // On check
  //   act(() =>
  //     wrapper
  //       .find('Checkbox')
  //       .at(0)
  //       .props()
  //       .onChange({ target: { checked: true } })
  //   )
  //   wrapper.update()

  //   act(() =>
  //     wrapper
  //       .find('Checkbox')
  //       .at(1)
  //       .props()
  //       .onChange({ target: { checked: true } })
  //   )
  //   wrapper.update()

  //   act(() =>
  //     wrapper
  //       .find('Checkbox')
  //       .at(0)
  //       .props()
  //       .onChange({ target: { checked: false } })
  //   )
  //   wrapper.update()
  // })

  // test('exportCSV', () => {
  //   wrapper.unmount()
  //   mockSimulation.mockImplementation(() => ({
  //     tasks: [
  //       {
  //         datas: [
  //           {
  //             name: 'data name',
  //             x: 0,
  //             y: 0
  //           },
  //           {
  //             name: 'data name',
  //             x: 1,
  //             y: 1
  //           },
  //           {
  //             name: 'data name 2',
  //             x: 0,
  //             y: 0
  //           },
  //           {
  //             name: 'data name 2',
  //             x: 2,
  //             y: 2
  //           }
  //         ]
  //       },
  //       {}
  //     ]
  //   }))

  //   wrapper = mount(<Data simulation={simulation} />)
  //   expect(wrapper).toBeDefined()

  //   // Open drawer
  //   act(() => wrapper.find('Button').at(0).props().onClick())
  //   wrapper.update()

  //   // Export CSV
  //   window.URL = {
  //     createObjectURL: () => {}
  //   }
  //   wrapper.find('Button').at(1).props().onClick()
  // })
})
