import Parameters from '@/components/project/simulation/parameters'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('@/components/assets/formula', () => {
  const Formula = () => <div />
  return Formula
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/simulation/parameters', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        parameters: {
          index: 0,
          title: 'title',
          param1: {
            label: 'param1',
            children: [
              {
                htmlEntity: 'formula'
              }
            ]
          },
          param2: {
            label: 'para2',
            advanced: true,
            children: [
              {
                htmlEntity: 'select'
              },
              {}
            ]
          }
        }
      }
    }
  }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }

  beforeEach(() => {
    wrapper = shallow(<Parameters simulation={simulation} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with value', () => {
    wrapper.unmount()
    simulation.scheme.configuration.parameters.param1.children[0].value = 0
    wrapper = shallow(<Parameters simulation={simulation} swr={swr} />)
    expect(wrapper).toBeDefined()
  })

  it('onChange', () => {
    wrapper.find('Formula').props().onValueChange()
    wrapper.find('ForwardRef(InternalSelect)').props().onChange()
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Parameters simulation={simulation} swr={swr} />)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Without value
    act(() => wrapper.find('Formula').props().onValueChange())
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    act(() => wrapper.find('Formula').props().onValueChange('value'))
    expect(mockUpdate).toHaveBeenCalledTimes(3)
  })
})
