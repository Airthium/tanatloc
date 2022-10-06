import { EditorContext } from '@/context/editor'
import { render } from '@testing-library/react'

import Steps from '..'

const mockSetModelValid = jest.fn()
const mockSetTemplateValid = jest.fn()
jest.mock('@/context/editor/actions', () => ({
  setModelValid: (valid: boolean) => mockSetModelValid(valid),
  setTemplateValid: (valid: boolean) => mockSetTemplateValid(valid)
}))

const mockCheckModel = jest.fn()
jest.mock('../utils', () => ({
  checkModel: () => mockCheckModel()
}))

const testModel = {
  category: 'category',
  name: 'name',
  algorithm: 'algorithm',
  code: 'code',
  version: 'version',
  configuration: {
    geometry: {}
  }
}

describe('components/editor/steps', () => {
  const setName = jest.fn()

  beforeEach(() => {
    mockSetModelValid.mockReset()
    mockSetTemplateValid.mockReset()

    mockCheckModel.mockReset()

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

  test('with context', () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: JSON.stringify(testModel),
          dispatch: jest.fn(),
          templateValid: false,
          modelValid: false
        }}
      >
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

  test('without model name, check error', () => {
    mockCheckModel.mockImplementation(() => {
      throw new Error('check error')
    })
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: JSON.stringify({ ...testModel, name: undefined }),
          dispatch: jest.fn(),
          templateValid: false,
          modelValid: false
        }}
      >
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

  test('without template', () => {
    const { rerender, unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: JSON.stringify(testModel),
          dispatch: jest.fn(),
          templateValid: false,
          modelValid: false
        }}
      >
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(1)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(false)
    expect(mockSetModelValid).toHaveBeenCalledTimes(1)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(true)

    expect(setName).toHaveBeenCalledTimes(1)
    expect(setName).toHaveBeenLastCalledWith('name')

    rerender(
      <EditorContext.Provider
        value={{
          template: 'template',
          model: JSON.stringify(testModel),
          dispatch: jest.fn(),
          templateValid: false,
          modelValid: false
        }}
      >
        <Steps setName={setName} />
      </EditorContext.Provider>
    )

    expect(mockSetTemplateValid).toHaveBeenCalledTimes(2)
    expect(mockSetTemplateValid).toHaveBeenLastCalledWith(true)
    expect(mockSetModelValid).toHaveBeenCalledTimes(2)
    expect(mockSetModelValid).toHaveBeenLastCalledWith(true)

    expect(setName).toHaveBeenCalledTimes(2)
    expect(setName).toHaveBeenLastCalledWith('name')

    unmount()
  })
})
