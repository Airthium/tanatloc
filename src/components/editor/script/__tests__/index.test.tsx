import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import Script from '..'

jest.mock('prism-themes/themes/prism-vs.css', () => () => '')

describe('components/editor/script', () => {
  const configuration = {}

  test('render', () => {
    const { unmount } = render(<Script configuration={configuration} />)

    unmount()
  })

  test('editor', async () => {
    const { unmount } = render(<Script configuration={configuration} />)

    const editor = screen.getByRole('textbox')
    await act(async () =>
      fireEvent.change(editor, { target: { value: 'some code' } })
    )

    unmount()
  })

  test('full configuration', async () => {
    const { unmount } = render(
      <Script
        configuration={{
          name: 'name',
          category: 'category',
          geometry: {
            meshable: true,
            name: 'Mesh'
          },
          materials: {
            children: [
              {
                index: 0,
                label: 'label',
                symbol: 'symbol',
                default: 1
              }
            ]
          },
          parameters: {
            key: {
              label: 'key',
              children: [
                {
                  label: 'label',
                  default: 0
                }
              ]
            }
          },
          initialization: {},
          boundaryConditions: {
            key: {
              label: 'key',
              children: [
                {
                  label: 'label',
                  default: 0
                }
              ]
            }
          }
        }}
      />
    )

    unmount()
  })

  test('geometry configuration', async () => {
    const { unmount } = render(
      <Script
        configuration={{
          name: 'name',
          category: 'category',
          geometry: {
            meshable: false,
            name: 'Mesh'
          }
        }}
      />
    )

    unmount()
  })
})
