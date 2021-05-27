import DeleteDialog from '@/components/assets/dialog/delete'
import { shallow } from 'enzyme'

let wrapper
describe('components/assets/dialog', () => {
  beforeEach(() => {
    wrapper = shallow(
      <DeleteDialog
        title="title"
        visible={false}
        onCancel={() => {}}
        onOk={() => {}}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })
})
