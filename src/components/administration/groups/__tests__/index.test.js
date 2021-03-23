import Groups from '..'
import { shallow, mount } from 'enzyme'
import '@/config/jest/mockMatchMedia'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/lib/utils', () => ({
  stringToColor: () => {},
  userToAvatar: () => {}
}))

const mockUsers = jest.fn()
jest.mock('@/api/user', () => ({
  useUsers: () => [mockUsers()]
}))

const mockGroups = jest.fn()
const mockAddOneGroup = jest.fn()
const mockMutateOneGroup = jest.fn()
const mockDelOneGroup = jest.fn()
const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup
    }
  ],
  add: async () => mockAdd(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

let wrapper
describe('components/administration/groups', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockUsers.mockReset()
    mockUsers.mockImplementation(() => [])

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [])
    mockAddOneGroup.mockReset()
    mockMutateOneGroup.mockReset()
    mockDelOneGroup.mockReset()
    mockAdd.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    wrapper = shallow(<Groups />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with users & groups', () => {
    wrapper.unmount()
    mockUsers.mockImplementation(() => [
      { id: 'id' },
      {
        email: 'email'
      },
      {
        id: 'id',
        firstname: 'firstname',
        avatar: 'img'
      },
      {
        id: 'id',
        lastname: 'lastname'
      }
    ])
    mockGroups.mockImplementation(() => [
      {
        name: 'group',
        users: [
          { id: 'id' },
          {
            email: 'email'
          },
          {
            id: 'id',
            firstname: 'firstname',
            avatar: 'img'
          },
          {
            id: 'id',
            lastname: 'lastname'
          }
        ]
      }
    ])
    wrapper = mount(<Groups />)
    expect(wrapper).toBeDefined()
  })

  it('onAdd', async () => {
    // Set edit
    wrapper.find('Button').props().onClick()
    wrapper.update()
    mockAdd.mockImplementation(() => ({}))
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockAddOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Set edit
    wrapper.find('Button').props().onClick()
    wrapper.update()
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockAddOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Stop edit
    wrapper.find('Button').at(1).props().onClick()
  })

  it('onUpdate', async () => {
    wrapper.unmount()
    mockGroups.mockImplementation(() => [{}])
    wrapper = shallow(<Groups />)

    const render = wrapper
      .find('Table')
      .props()
      .columns[2].render('text', { key: 'value', users: [{ id: 'id1' }] })

    // Set edit
    render.props.children[0].props.onClick()
    wrapper.update()

    await wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onFinish({ key: 'value', name: 'name', users: ['id'] })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutateOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Set edit
    render.props.children[0].props.onClick()
    wrapper.update()

    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper
      .find('ForwardRef(InternalForm)')
      .props()
      .onFinish({ key: 'value', users: ['id1'] })
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockMutateOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('onDelete', async () => {
    wrapper.unmount()
    mockGroups.mockImplementation(() => [{}])
    wrapper = shallow(<Groups />)

    const render = wrapper
      .find('Table')
      .props()
      .columns[2].render('text', { key: 'value', users: [{}] })

    // Normal
    await render.props.children[1].props.onClick()
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockDelOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    await render.props.children[1].props.onClick()
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockDelOneGroup).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
