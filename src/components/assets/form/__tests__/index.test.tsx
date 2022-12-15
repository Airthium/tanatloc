import * as Form from '..'

jest.mock('../list', () => ({
  FormListContainer: () => <div />,
  FormListItem: () => <div />
}))

describe('components/assets/form', () => {
  test('exists', () => {
    expect(Form.FormListContainer).toBeDefined()
    expect(Form.FormListItem).toBeDefined()
  })
})
