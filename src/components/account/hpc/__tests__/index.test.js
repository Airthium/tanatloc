import HPC from '..'
import { mount } from 'enzyme'

jest.mock('@/components/account/hpc/plugin', () => {
  const Plugin = () => <div />
  return Plugin
})

jest.mock('@/plugins', () => ({
  NonHPCPlugin: {
    category: 'Other'
  },
  TestPlugin: {
    category: 'HPC',
    key: 'plugin',
    name: 'Test plugin'
  },
  TestUnauthorizedPlugin: {
    category: 'HPC',
    key: 'unauthorized',
    name: 'Unauthorized'
  }
}))

let wrapper
describe('components/account/hpc', () => {
  const user = {
    authorizedplugins: []
  }

  // beforeEach(() => {
  //   wrapper = mount(<HPC user={user} />)
  // })

  // afterEach(() => {
  //   wrapper.unmount()
  // })

  // it('render', () => {
  //   expect(wrapper).toBeDefined()
  // })

  // it('without authorizedplugins', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<HPC user={user} />)
  //   expect(wrapper).toBeDefined()
  // })

  // it('with authorized plugins', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<HPC user={{ ...user, authorizedplugins: ['plugin'] }} />)
  //   expect(wrapper).toBeDefined()
  // })
})
