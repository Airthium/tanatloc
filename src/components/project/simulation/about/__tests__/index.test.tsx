import { render } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import About from '@/components/project/simulation/about'

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />,
  Html: () => <div />
}))

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
      userModelId: 'id',
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {}
    }
  } as Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>
  const swr = {
    mutateProject: jest.fn(),
    addOneSimulation: jest.fn(),
    delOneSimulation: jest.fn(),
    mutateOneSimulation: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(
      <About project={project} simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('without simulation', () => {
    const { unmount } = render(<About project={project} swr={swr} />)

    unmount()
  })
})
