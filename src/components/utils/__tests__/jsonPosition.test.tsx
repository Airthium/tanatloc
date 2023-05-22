import { getHighlightPosition } from '../jsonPosition'

describe('src/components/utils/jsonPosition', () => {
  const oldModel = JSON.stringify(
    {
      title: 'title',
      description: null
    },
    null,
    '\t'
  )
  const newModel = JSON.stringify(
    {
      title: 'title',
      description: 'description'
    },
    null,
    '\t'
  )

  test('getHighlightPosition', () => {
    const pos = getHighlightPosition(oldModel, newModel)
    expect(pos).toEqual({ begin: 2, end: 2 })
  })
})
