import { EditorContext } from '@/context/editor'
import { fireEvent, render, screen } from '@testing-library/react'

import Blobs from '..'

jest.mock('../mesh', () => (props: any) => (
  <div role="Mesh" onClick={props.onAdd} />
))
jest.mock('../materials', () => (props: any) => (
  <div role="Materials" onClick={() => props.onAdd([{}])} />
))

describe('components/editor/blobs', () => {
  test('render', () => {
    const { unmount } = render(<Blobs />)

    unmount()
  })

  test('with cursor', () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: '',
          cursor: { row: 1, column: 2 },
          modelValid: true,
          templateValid: true,
          dispatch: jest.fn()
        }}
      >
        <Blobs />
      </EditorContext.Provider>
    )

    const collpase = screen.getByRole('button', { name: 'right Head' })
    fireEvent.click(collpase)

    const header = screen.getByRole('button', { name: 'Header' })
    fireEvent.click(header)

    unmount()
  })

  test('Head', () => {
    const { unmount } = render(<Blobs />)

    const collpase = screen.getByRole('button', { name: 'right Head' })
    fireEvent.click(collpase)

    const header = screen.getByRole('button', { name: 'Header' })
    fireEvent.click(header)

    const dimension = screen.getByRole('button', { name: 'Dimension' })
    fireEvent.click(dimension)

    unmount()
  })

  test('Components', () => {
    const { unmount } = render(<Blobs />)

    const collpase = screen.getByRole('button', { name: 'right Components' })
    fireEvent.click(collpase)

    const mesh = screen.getByRole('Mesh')
    fireEvent.click(mesh)

    const materials = screen.getByRole('Materials')
    fireEvent.click(materials)

    const finiteElementSpace = screen.getByRole('button', {
      name: 'Finite element space'
    })
    fireEvent.click(finiteElementSpace)

    const finiteElementFunction = screen.getByRole('button', {
      name: 'Finite element function'
    })
    fireEvent.click(finiteElementFunction)

    const macros = screen.getByRole('button', { name: 'Macros' })
    fireEvent.click(macros)

    unmount()
  })

  test('Components with context', () => {
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template:
            "include('/blobs/mesh.edp.ejs') include('/blobs/materials.edp.ejs')",
          model: '',
          cursor: { row: 1, column: 2 },
          modelValid: true,
          templateValid: true,
          dispatch: jest.fn()
        }}
      >
        <Blobs />
      </EditorContext.Provider>
    )

    const collpase = screen.getByRole('button', { name: 'right Components' })
    fireEvent.click(collpase)

    const mesh = screen.getByRole('Mesh')
    fireEvent.click(mesh)

    const materials = screen.getByRole('Materials')
    fireEvent.click(materials)

    unmount()
  })
})