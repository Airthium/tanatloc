import Project from '../../../components/project'
import { shallow } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {}
  })
}))

jest.mock('react-three-fiber', () => ({
  extend: () => {},
  Canvas: 'canvas',
  useThree: () => [],
  useFrame: () => {}
}))

jest.mock('three/examples/jsm/controls/OrbitControls', () => ({}))

let wrapper
describe('components/project', () => {
  beforeEach(() => {
    wrapper = shallow(<Project />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
