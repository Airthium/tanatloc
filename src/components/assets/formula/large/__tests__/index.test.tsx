import { fireEvent, render, screen } from '@testing-library/react'

import Large from '..'

const mockParse = jest.fn()
jest.mock('@airthium/tanatloc-formula-validator', () => ({
  parse: () => mockParse()
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('@/components/assets/mathjax', () => ({
  Inline: (props: any) => props.text
}))

describe('components/assets/formula/large', () => {
  const initialValue = '0'
  const additionalKeywords = [
    { label: 'Ux', value: 'Ux' },
    { label: 'Uz', value: 'Uz', only3D: true }
  ]
  const units = [{ label: 'm' }, { label: 'mm' }]
  const unit = { label: 'm' }
  const onChange = jest.fn()
  const onUnitChange = jest.fn()

  beforeEach(() => {
    mockParse.mockReset()

    mockDialog.mockImplementation(() => <div />)

    onChange.mockReset()
    onUnitChange.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Large initialValue={initialValue} onChange={onChange} />
    )

    unmount()
  })

  test('additional keywords', () => {
    const { unmount } = render(
      <Large
        dimension={2}
        initialValue={initialValue}
        additionalKeywords={additionalKeywords}
        onChange={onChange}
      />
    )

    unmount()
  })

  test('open', () => {
    const { unmount } = render(
      <Large initialValue={initialValue} onChange={onChange} />
    )

    const icon = screen.getByRole('img')
    fireEvent.click(icon)

    unmount()
  })

  test('close', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Large initialValue={initialValue} onChange={onChange} />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('on value change', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockParse.mockImplementation(() => {
      throw new Error('parse error')
    })
    const { unmount } = render(
      <Large initialValue={initialValue} onChange={onChange} />
    )

    const textArea = screen.getByRole('textbox')
    fireEvent.change(textArea, { target: { value: '2.*x' } })

    unmount()
  })

  test('on value change, with additional keywords', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockParse.mockImplementation(() => {
      throw new Error('parse error')
    })
    const { unmount } = render(
      <Large
        dimension={2}
        initialValue={initialValue}
        additionalKeywords={additionalKeywords}
        onChange={onChange}
      />
    )

    const textArea = screen.getByRole('textbox')
    fireEvent.change(textArea, { target: { value: '2.*x' } })

    unmount()
  })

  test('on unit change', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Large
        initialValue={initialValue}
        units={units}
        unit={unit}
        onChange={onChange}
        onUnitChange={onUnitChange}
      />
    )

    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => fireEvent.click(radio))

    expect(onUnitChange).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('on ok', () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Large
        initialValue={initialValue}
        units={units}
        unit={unit}
        onChange={onChange}
        onUnitChange={onUnitChange}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    expect(onChange).toHaveBeenCalledTimes(1)

    unmount()
  })
})
