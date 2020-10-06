import Geometry from '../../../../../components/project/simulation/geometry'
import { shallow, mount } from 'enzyme'

const mockUpdate = jest.fn()
const mockMutate = jest.fn()
jest.mock('../../../../../../src/api/simulation', () => ({
  update: async () => mockUpdate(),
  useSimulations: () => [[], { mutateOneSimulation: mockMutate }]
}))

const mockGet = jest.fn()
jest.mock('../../../../../../src/api/file', () => ({
  get: async () => mockGet()
}))

global.FileReader = class {
  constructor() {
    this.result = 'result'
  }
  addEventListener(type, callback) {
    callback()
  }
  readAsArrayBuffer() {}
}

let wrapper
describe('renderer/components/project/simulation/geometry', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockMutate.mockReset()
    mockGet.mockReset()
    wrapper = shallow(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {}
            }
          }
        }}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('onDelete', async () => {
    console.log(wrapper.debug())
    await wrapper.find('ForwardRef').props().onConfirm()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('upload', async () => {
    let res
    wrapper.unmount()

    // Before upload
    wrapper = mount(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {}
            }
          }
        }}
      />
    )
    res = wrapper.find('Upload').at(0).props().beforeUpload({
      name: 'test.STP'
    })
    expect(res).toBe(true)

    res = wrapper.find('Upload').at(0).props().beforeUpload({
      name: 'test.DXF'
    })
    expect(res).toBe(true)

    res = wrapper.find('Upload').at(0).props().beforeUpload({
      name: 'test.OTHER'
    })
    expect(res).toBe(false)

    // On change
    await wrapper
      .find('Upload')
      .at(0)
      .props()
      .onChange({
        file: {
          status: 'uploading'
        }
      })
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockMutate).toHaveBeenCalledTimes(0)

    await wrapper
      .find('Upload')
      .at(0)
      .props()
      .onChange({
        file: {
          status: 'done'
        }
      })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  it('mount with file', async () => {
    wrapper.unmount()

    wrapper = mount(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {
                file: {}
              }
            }
          }
        }}
      />
    )
  })

  it('download', async () => {
    wrapper.unmount()
    wrapper = mount(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {
                file: {
                  origin: 'origin',
                  originPath: 'originPath'
                }
              }
            }
          }
        }}
      />
    )
    mockGet.mockImplementation(() => ({
      buffer: ['buffer']
    }))

    window.URL.createObjectURL = () => 'url'

    await wrapper.find('Button').at(0).props().onClick()
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  it('with part', () => {
    wrapper.unmount()
    wrapper = shallow(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {}
            }
          }
        }}
        part={{}}
      />
    )

    wrapper.unmount()
    wrapper = shallow(
      <Geometry
        project={{}}
        simulation={{
          scheme: {
            categories: {
              geometry: {}
            }
          }
        }}
        part={{
          solids: [{}],
          faces: [{}],
          edges: [{}]
        }}
      />
    )
  })
})
