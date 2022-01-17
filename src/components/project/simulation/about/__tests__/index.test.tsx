import React from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import { render } from '@testing-library/react'

import About from '@/components/project/simulation/about'

jest.mock('../../copy', () => () => <div />)

jest.mock('../edit', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

describe('components/project/simulation/about', () => {
  const project = {
    id: 'id',
    simulations: ['id']
  }
  const simulation = {
    id: 'id',
    name: 'name',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {}
    }
  }
  const swr = {
    mutateProject: jest.fn(),
    addOneSimulation: jest.fn(),
    delOneSimulation: jest.fn(),
    mutateOneSimulation: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(
      <MathJaxContext>
        <About project={project} simulation={simulation} swr={swr} />
      </MathJaxContext>
    )

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(
      <MathJaxContext>
        <About project={project} swr={swr} />
      </MathJaxContext>
    )

    unmount()
  })
})
