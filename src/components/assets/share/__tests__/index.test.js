import Share from '..'
import { shallow, mount } from 'enzyme'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockUpdate()
}))

let wrapper
describe('components/project/share', () => {
  const project = { id: 'id' }
  const organizations = []
  const mutateOneProject = jest.fn()
  const swr = { mutateOneProject }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    wrapper = shallow(
      <Share project={project} organizations={organizations} swr={swr} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('setVisible', () => {
    // Visible
    wrapper.find('Button').props().onClick()

    // Not visible
    wrapper.find('Dialog').props().onCancel()
  })

  it('onSelectChange', () => {
    wrapper.find('ForwardRef(InternalTreeSelect)').props().onChange()
  })

  it('onShare', async () => {
    // Normal
    await wrapper.find('Dialog').props().onOk()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await wrapper.find('Dialog').props().onOk()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mutateOneProject).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  it('effect', () => {
    // Emty organizations
    wrapper.unmount()
    wrapper = mount(
      <Share project={project} organizations={organizations} swr={swr} />
    )

    // Full
    wrapper.unmount()
    wrapper = mount(
      <Share
        project={{ ...project, groups: [{ id: 'id' }] }}
        organizations={[
          {
            groups: [
              {
                id: 'id',
                users: [
                  {
                    firstname: 'firstname'
                  },
                  {
                    email: 'email'
                  }
                ]
              }
            ]
          }
        ]}
        swr={swr}
      />
    )
  })
})
