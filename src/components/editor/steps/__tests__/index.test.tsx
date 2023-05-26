import { EditorContext } from '@/context/editor'
import { render } from '@testing-library/react'

const mockValidate = jest.fn()
//@ts-ignore
mockValidate.errors = [{}]
jest.mock('ajv', () => {
  return jest.fn().mockImplementation(() => ({
    compile: () => mockValidate
  }))
})

import Steps from '..'

const mockSetModelValid = jest.fn()
const mockSetTemplateValid = jest.fn()
jest.mock('@/context/editor/actions', () => ({
  setJsonError: () => jest.fn(),
  setModelValid: (valid: boolean) => mockSetModelValid(valid),
  setTemplateValid: (valid: boolean) => mockSetTemplateValid(valid)
}))

const contextValue = {
  template: 'template',
  model: '{ test: "test", name: "name" }',
  dispatch: jest.fn(),
  templateValid: false,
  modelValid: false
}

describe('components/editor/steps', () => {
  const setName = jest.fn()

  beforeEach(() => {
    mockSetModelValid.mockReset()
    mockSetTemplateValid.mockReset()

    setName.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Steps setName={setName} />)

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(1)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(false)
    expect(mockSetModelValid).toHaveBeenCalledTimes(1)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(false)

    unmount()
  })

  test('JSON5', () => {
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    unmount()
  })

  test('with context', () => {
    mockValidate.mockImplementation(() => true)
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(1)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(true)
    expect(mockSetModelValid).toHaveBeenCalledTimes(1)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(true)

    expect(setName).toHaveBeenCalledTimes(1)
    expect(setName).toHaveBeenLastCalledWith('name')

    unmount()
  })

  test('syntax error', () => {
    mockValidate.mockImplementation(() => {
      throw new Error('validate error')
    })
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(1)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(true)
    expect(mockSetModelValid).toHaveBeenCalledTimes(1)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(false)

    expect(setName).toHaveBeenCalledTimes(0)

    unmount()
  })

  test('schema error', () => {
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(1)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(true)
    expect(mockSetModelValid).toHaveBeenCalledTimes(1)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(false)

    expect(setName).toHaveBeenCalledTimes(0)

    unmount()
  })
})
