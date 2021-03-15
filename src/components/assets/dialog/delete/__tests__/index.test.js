import DeleteDialog from '@/components/assets/dialog/delete'
import { shallow } from 'enzyme'

let wrapper
describe('components/assets/dialog', () => {
  beforeEach(() => {
    wrapper = shallow(
      <DeleteDialog
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
