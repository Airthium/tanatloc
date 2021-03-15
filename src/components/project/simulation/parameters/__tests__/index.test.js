import Parameters from '@/components/project/simulation/parameters'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/formula', () => 'formula')

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

let wrapper
describe('components/project/simulation/parameters', () => {
  const project = {}
  const simulation = {
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

  beforeEach(() => {
    wrapper = shallow(<Parameters project={project} simulation={simulation} />)
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
    wrapper = shallow(<Parameters project={project} simulation={simulation} />)
  })

  it('onChange', () => {
    wrapper.find('formula').props().onValueChange()
    wrapper.find('ForwardRef(InternalSelect)').props().onChange()
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Parameters project={project} simulation={simulation} />)

    wrapper.find('formula').props().onValueChange()
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    wrapper.find('formula').props().onValueChange('new value')
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    wrapper.find('formula').props().onValueChange('new value')
  })
})
