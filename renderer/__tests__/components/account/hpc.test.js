import HPC from '../../../components/account/hpc'
import { shallow } from 'enzyme'

jest.mock('../../../../plugin', () => ({
  NonHPCPlugin: {
    category: 'Other'
  },
  TestPlugin: {
    category: 'HPC',
    key: 'plugin',
    name: 'Test plugin',
    logo: 'logo'
  },
  TestPluginConfiguration: {
    category: 'HPC',
    key: 'pluginConfiguration',
    name: 'Test plugin configuration',
    configuration: {
      password: {
        label: 'Password',
        type: 'password'
      },
      select: {
        type: 'select',
        options: ['option1', 'option2']
      },
      other: {
        type: 'other'
      }
    }
  }
}))

const mockUser = jest.fn()
const mockMutateUser = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../../../../src/api/user', () => ({
  useUser: () => [mockUser(), { mutateUser: mockMutateUser }],
  update: () => mockUpdate()
}))

const mockSentry = jest.fn()
jest.mock('../../../../src/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

let wrapper
describe('renderer/components/account/hpc', () => {
  beforeEach(() => {
    mockUser.mockReset()
    mockUser.mockImplementation(() => ({}))
    mockMutateUser.mockReset()
    mockUpdate.mockReset()

    mockSentry.mockReset()

    wrapper = shallow(<HPC />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  // it('user plugins', () => {
  //   wrapper.unmount()
  //   mockUser.mockImplementation(() => ({
  //     plugins: [
  //       {
  //         category: 'HPC',
  //         key: 'pluginConfiguration',
  //         name: 'Test plugin configuration',
  //         configuration: {
  //           password: {
  //             label: 'Password',
  //             type: 'password',
  //             value: 'password'
  //           },
  //           select: {
  //             type: 'select',
  //             options: ['option1', 'option2'],
  //             value: 'option1'
  //           },
  //           other: {
  //             type: 'other'
  //           }
  //         }
  //       }
  //     ]
  //   }))

  //   wrapper = shallow(<HPC />)
  //   expect(wrapper).toBeDefined()
  // })

  // it('onFinish', async () => {
  //   await wrapper
  //     .find('ForwardRef(InternalForm)')
  //     .props()
  //     .onFinish({ password: 'password', select: 'option1' })
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockMutateUser).toHaveBeenCalledTimes(1)
  //   expect(mockSentry).toHaveBeenCalledTimes(0)

  //   // With user plugins
  //   wrapper.unmount()
  //   mockUser.mockImplementation(() => ({
  //     plugins: [
  //       {
  //         category: 'HPC',
  //         key: 'pluginConfiguration',
  //         name: 'Test plugin configuration',
  //         configuration: {
  //           password: {
  //             label: 'Password',
  //             type: 'password',
  //             value: 'password'
  //           },
  //           select: {
  //             type: 'select',
  //             options: ['option1', 'option2'],
  //             value: 'option1'
  //           },
  //           other: {
  //             type: 'other'
  //           }
  //         }
  //       }
  //     ]
  //   }))
  //   wrapper = shallow(<HPC />)
  //   await wrapper
  //     .find('ForwardRef(InternalForm)')
  //     .props()
  //     .onFinish({ password: 'password', select: 'option1' })
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mockMutateUser).toHaveBeenCalledTimes(2)
  //   expect(mockSentry).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper
  //     .find('ForwardRef(InternalForm)')
  //     .props()
  //     .onFinish({ password: 'password', select: 'option1' })
  //   expect(mockUpdate).toHaveBeenCalledTimes(3)
  //   expect(mockMutateUser).toHaveBeenCalledTimes(2)
  //   expect(mockSentry).toHaveBeenCalledTimes(1)
  // })
})
