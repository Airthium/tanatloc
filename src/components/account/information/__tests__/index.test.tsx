import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Information, { errors } from '..'

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props: any) => mockUpload(props))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockSuccessNotification = jest.fn()
const mockErrorNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  SuccessNotification: () => mockSuccessNotification(),
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err),
  FormError: () => mockFormError()
}))

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => mockAPIError(apiError))
}))

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: async (update: any) => mockUpdate(update)
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async (avatar: any) => mockAdd(avatar)
}))

Object.defineProperty(global, 'FileReader', {
  value: class {
    addEventListener(_: any, callback: Function) {
      callback()
    }
    readAsDataURL() {
      // mock method
    }
    result = 'img'
  }
})

describe('components/account/information', () => {
  const user = {
    email: 'test@tanatloc.com',
    firstname: 'firstname',
    lastname: 'lastname'
  }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockSuccessNotification.mockReset()
    mockErrorNotification.mockReset()
    mockFormError.mockReset()
    mockFormError.mockImplementation(() => <div />)

    mockAPIError.mockReset()

    mockUpdate.mockReset()

    mockAdd.mockReset()

    swr.mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    unmount()
  })

  test('electron', () => {
    mockIsElectron.mockImplementation(() => true)
    const { unmount } = render(<Information user={user} swr={swr} />)

    unmount()
  })

  test('empty', () => {
    const { unmount } = render(
      <Information user={{ email: 'email' }} swr={swr} />
    )

    unmount()
  })

  test('with avatar', () => {
    const { unmount } = render(
      <Information
        user={{ ...user, avatar: Buffer.from('buffer') }}
        swr={swr}
      />
    )

    unmount()
  })

  test('beforeUpload', () => {
    let file: File
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
        onClick={(e) => props.beforeUpload(e.target.files[0])}
      />
    ))

    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('Upload')

    // Wrong format
    file = new File(['buffer'], 'file.png', { type: 'application/mesh' })
    fireEvent.click(upload, { target: { files: [file] } })
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.badFormat,
        undefined
      )
    )

    // Wrong size
    file = new File([Buffer.alloc(5 * 1024 * 1024)], 'file.png', {
      type: 'image/png'
    })
    fireEvent.click(upload, { target: { files: [file] } })
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.badSize,
        undefined
      )
    )

    // Good format
    file = new File(['buffer'], 'file.png', { type: 'image/png' })
    fireEvent.click(upload, { target: { files: [file] } })

    unmount()
  })

  test('onChange', () => {
    let info: any
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        onClick={async (e) => {
          //@ts-ignore
          props.onChange(JSON.parse(e.target.value))
        }}
      />
    ))

    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('Upload')

    // Uploading
    info = { file: { status: 'uploading' } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })

    info = { file: { status: 'other' } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })

    // Done
    info = {
      file: { status: 'done', name: 'name', uid: 'uid', originFileObj: {} }
    }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockAdd).toHaveBeenLastCalledWith({
        name: 'name',
        uid: 'uid',
        data: 'img'
      })
    )
    waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.upload,
        new Error('add error')
      )
    )

    unmount()
  })

  test('onFinish', () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const submit = screen.getByRole('button', { name: 'Save changes' })
    const email = screen.getByRole('textbox', { name: 'Email' })
    const firstname = screen.getByRole('textbox', { name: 'First name' })
    const lastname = screen.getByRole('textbox', { name: 'Last name' })

    // Not changed
    fireEvent.click(submit)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))

    // Firstname
    fireEvent.change(firstname, { target: { value: 'firstname1' } })
    fireEvent.click(submit)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith([
        { key: 'firstname', value: 'firstname1' }
      ])
    )
    waitFor(() => expect(mockSuccessNotification).toHaveBeenCalledTimes(0))

    // Email
    fireEvent.change(email, { target: { value: 'test1@tanatloc.com' } })
    fireEvent.click(submit)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith([
        { key: 'email', value: 'test1@tanatloc.com' },
        { key: 'firstname', value: 'firstname1' }
      ])
    )
    waitFor(() => expect(mockSuccessNotification).toHaveBeenCalledTimes(1))

    // Lastname
    fireEvent.change(lastname, { target: { value: 'lastname1' } })
    fireEvent.click(submit)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith([
        { key: 'email', value: 'test1@tanatloc.com' },
        { key: 'firstname', value: 'firstname1' },
        { key: 'lastname', value: 'lastname1' }
      ])
    )
    waitFor(() => expect(mockSuccessNotification).toHaveBeenCalledTimes(2))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(submit)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(4))
    waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({
        title: errors.update,
        err: new Error('update error')
      })
    )

    unmount()
  })
})
