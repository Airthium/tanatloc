import List from '../../../components/project/list'
import { shallow } from 'enzyme'

let wrapper
describe('component/project/list', () => {
  beforeEach(() => {
    wrapper = shallow(<List />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onCell', () => {
    const func = wrapper.find('Column').at(0).props().onCell('record')
    func.onClick()
  })

  it('render', () => {
    const render = wrapper.find('Column').at(4).props().render()
    // expect(render).toBe(
    //   <Space size="middle">
    //     <Button key="share" icon={<ShareAltOutlined />}>
    //       Share
    //     </Button>
    //     <Button icon={<DeleteOutlined />}>Delete</Button>
    //   </Space>
    // )
  })
})
