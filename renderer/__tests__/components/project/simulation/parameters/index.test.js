import Parameters from '../../../../../components/project/simulation/parameters'
import { shallow, mount } from 'enzyme'

jest.mock('../../../../../components/assets/formula', () => 'formula')

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

let wrapper
describe('renderer/components/project/simulation/parameters', () => {
  const project = {}
  const simulation = {
    scheme: {
      categories: {
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

  it('onChange', () => {
    wrapper.find('formula').props().onChange()
    wrapper.find('Select').props().onChange()
  })

  it('effect', () => {
    wrapper.unmount()

    wrapper = mount(<Parameters project={project} simulation={simulation} />)

    wrapper.find('formula').props().onChange()
    wrapper.find('formula').props().onChange('new value')
  })
})
