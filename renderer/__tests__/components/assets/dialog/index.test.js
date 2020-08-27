import Dialog from '../../../../components/assets/dialog'
import { shallow } from 'enzyme'

let wrapper
describe('renderer/components/assets/dialog', () => {
  beforeEach(() => {
    wrapper = shallow(
      <Dialog
        title="title"
        visible={false}
        onCancel={() => {}}
        onOk={() => {}}
        loading={false}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })
})
