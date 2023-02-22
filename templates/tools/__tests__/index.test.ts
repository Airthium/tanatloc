import { indent } from '..'

describe('templates/tools', () => {
  test('indent', () => {
    const indented = indent('test\n\ntest', 1)
    expect(indented).toBe('\ttest\n\n\ttest\n')
  })
})
