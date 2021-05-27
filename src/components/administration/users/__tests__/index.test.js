import Users from '..'
import { shallow } from 'enzyme'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../edit', () => {
  const Edit = () => <div />
  return Edit
})

jest.mock('../delete', () => {
  const Delete = () => <div />
  return Delete
})

jest.mock('@/plugins', () => ({
  key: {
    name: 'name',
    category: 'category'
  }
}))

let wrapper
describe('components/administration/users', () => {
  const users = [{}]
  const addOneUser = jest.fn()
  const delOneUser = jest.fn()
  const mutateOneUser = jest.fn()
  const swr = { addOneUser, delOneUser, mutateOneUser }

  beforeEach(() => {
    wrapper = shallow(<Users users={users} swr={swr} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('render', () => {
    expect(wrapper).toBeDefined()
  })

  test('columns', () => {
    const columns = wrapper.find('Table').props().columns

    // Sorters
    columns[0].sorter({ firstname: 'a' }, { firstname: 'b' })
    columns[1].sorter({ lastname: 'a' }, { lastname: 'b' })
    columns[2].sorter({ emailname: 'a' }, { emailname: 'b' })

    // Renders
    columns[3].render()
    columns[4].render(['key'])
    columns[5].render(true)
    columns[5].render(false)
    columns[6].render()
  })
})
