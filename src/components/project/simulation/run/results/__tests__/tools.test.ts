import { getFilesNumbers, getMultiplicator } from '../tools'

describe('@/components/project/simulation/run/results/tools', () => {
  test('getFilesNumbers', () => {
    const filesWithNumbers = getFilesNumbers(
      [
        {
          fileName: 'Result_0.vtu',
          type: 'result',
          originPath: 'originPath',
          geometry: 'id'
        }
      ],
      {
        name: 'name',
        pattern: 'Result_%d.vtu',
        prefixPattern: 'Result_',
        suffixPattern: '.vtu'
      }
    )
    expect(filesWithNumbers).toEqual([
      {
        fileName: 'Result_0.vtu',
        type: 'result',
        originPath: 'originPath',
        geometry: 'id',
        number: 0
      }
    ])
  })

  test('getMultiplicator', () => {
    const multiplicator = getMultiplicator(
      //@ts-ignore
      {
        parameters: {
          index: 1,
          title: 'Parameters',
          time: {
            label: 'label',
            children: [
              { label: 'label', htmlEntity: 'formula', default: 0 },
              { label: 'label', htmlEntity: 'formula', default: 0.1 }
            ]
          }
        }
      },
      {
        name: 'name',
        pattern: 'Result_%d.vtu',
        prefixPattern: 'Result_',
        suffixPattern: '.vtu',
        multiplicator: ['parameters', 'time', 'children', '1']
      }
    )
    expect(multiplicator).toEqual(0.1)

    // Without multiplicator path
    expect(
      getMultiplicator(
        //@ts-ignore
        {},
        {
          name: 'name',
          pattern: 'Result_%d.vtu',
          prefixPattern: 'Result_',
          suffixPattern: '.vtu'
        }
      )
    ).toBe(undefined)
  })
})
