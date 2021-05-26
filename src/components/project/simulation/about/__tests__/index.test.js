import About from '@/components/project/simulation/about'
import { shallow, mount } from 'enzyme'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/project/simulation/delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/simulation/about', () => {
  const simulation = {
    id: 'id',
    name: 'name'
  }
  const reloadProject = jest.fn()
  const delOneSimulation = jest.fn()
  const mutateOneSimulation = jest.fn()
  const swr = {
    reloadProject,
    delOneSimulation,
    mutateOneSimulation
  }

  beforeEach(() => {
    mockUpdate.mockReset()

    wrapper = shallow(<About simulation={simulation} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('handleName', async () => {
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Title').props().editable.onChange('name')
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('without simulation', () => {
    wrapper.unmount()
    wrapper = shallow(<About swr={swr} />)
    expect(wrapper).toBeDefined()
  })

  // it('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<About simulation={simulation} swr={swr} />)
  //   expect(wrapper).toBeDefined()
  // })
})
