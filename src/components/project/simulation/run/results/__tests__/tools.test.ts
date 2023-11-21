import { IModelRun } from '@/models/index.d'

import { ISimulationTaskFile } from '@/database/simulation'
import {
  getFilesNumbers,
  getMinMax,
  getMultiplicator,
  separateFiles
} from '../tools'

describe('@/components/project/simulation/run/results/tools', () => {
  test('separateFiles', () => {
    const { filteredFiles, notFilteredFiles } = separateFiles(
      [
        { fileName: 'Result_0.vtu' },
        { fileName: 'mesh.vtu' }
      ] as ISimulationTaskFile[],
      {
        pattern: 'Result_0.vtu'
      } as NonNullable<IModelRun['resultsFilter']>
    )

    expect(filteredFiles).toEqual([{ fileName: 'Result_0.vtu' }])
    expect(notFilteredFiles).toEqual([{ fileName: 'mesh.vtu' }])

    // Array pattern
    separateFiles(
      [
        { fileName: 'Result_0.vtu' },
        { fileName: 'mesh.vtu' }
      ] as ISimulationTaskFile[],
      {
        pattern: ['Result_0.vtu']
      } as NonNullable<IModelRun['resultsFilter']>
    )
  })
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

    const filesWithNumbersArray = getFilesNumbers(
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
        pattern: ['Result_%d.vtu'],
        prefixPattern: ['Result_'],
        suffixPattern: ['.vtu']
      }
    )
    expect(filesWithNumbersArray).toEqual([
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

  test('getMinMax', () => {
    const { min, max } = getMinMax([
      { number: 1 },
      { number: 10 }
    ] as (ISimulationTaskFile & { number: number })[])
    expect(min).toBe(1)
    expect(max).toBe(10)
  })
})
