import {
  AddButton,
  EditButton,
  DeleteButton,
  DownloadButton,
  GoBack,
  CancelButton,
  LinkButton
} from '..'

jest.mock('../add', () => () => <div />)

jest.mock('../edit', () => () => <div />)

jest.mock('../delete', () => () => <div />)

jest.mock('../download', () => () => <div />)

jest.mock('../goBack', () => () => <div />)

jest.mock('../cancel', () => () => <div />)

jest.mock('../link', () => () => <div />)

describe('components/assets/button', () => {
  test('import', () => {
    expect(AddButton).toBeDefined()
    expect(EditButton).toBeDefined()
    expect(DeleteButton).toBeDefined()
    expect(DownloadButton).toBeDefined()
    expect(GoBack).toBeDefined()
    expect(CancelButton).toBeDefined()
    expect(LinkButton).toBeDefined()
  })
})
