import Error from '..'
import { shallow } from 'enzyme'

const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => () => ({
    reload: () => mockReload()
  })
}))

let wrapper
describe('src/components/error', () => {
  beforeEach(() => {
    wrapper = shallow(<Error />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('with statusCode', () => {
    wrapper.unmount()
    wrapper = shallow(<Error statusCode={200} />)
    expect(wrapper).toBeDefined()
  })

  it('getInitialProps', () => {
    let code

    const res = {}
    const err = {}
    code = Error.getInitialProps({ res, err })
    expect(code).toEqual({ statusCode: undefined })

    res.statusCode = 200
    code = Error.getInitialProps({ res, err })
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({ res: null, err })
    expect(code).toEqual({ statusCode: undefined })

    err.statusCode = 200
    code = Error.getInitialProps({ res: null, err })
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({ res: null, err: null })
    expect(code).toEqual({ statusCode: 404 })
  })
})
