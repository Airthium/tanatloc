import * as FormList from '..'

jest.mock('../container', () => () => <div />)

jest.mock('../item', () => () => <div />)

describe('components/assets/form/list', () => {
  test('exists', () => {
    expect(FormList.FormListContainer).toBeDefined()
    expect(FormList.FormListItem).toBeDefined()
  })
})
