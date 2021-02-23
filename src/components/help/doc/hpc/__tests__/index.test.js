import HPC from '../'
import {shallow} from 'enzyme'

let wrapper
describe('src/components/help/doc/hpc', () => {
    beforeEach(() => {
        wrapper = shallow(<HPC/>)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('render', () => {
        expect(wrapper).toBeDefined()
    })
})
