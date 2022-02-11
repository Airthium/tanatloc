import React from 'react'
import { Select } from 'antd'

import { IModel } from '@/models/index.d'

const setupSelector = (
  filter: IModel['configuration']['run']['resultsFilters'][0],
  numbers: number[],
  multiplicator: number,
  filterIndex: number,
  resultIndex: number,
  onSelectorChange: Function,
  selectorsCurrent: any
) => {
  return (
    <div key={filter.name}>
      {filter.name}:{' '}
      <Select
        defaultValue={numbers[0]}
        options={numbers.map((n, i) => ({
          label: multiplicator ? n * multiplicator : i,
          value: n
        }))}
        style={{ width: '100%' }}
        value={
          selectorsCurrent[filterIndex] &&
          selectorsCurrent[filterIndex] * (multiplicator || 1)
        }
        onChange={(value) => onSelectorChange(value, resultIndex, filterIndex)}
      />
    </div>
  )
}

/**
 * On selector change
 * @param {number} value Value
 * @param {number} index Index
 * @param {number} filterIndex Filter index
 */
const resultManager = (
  value: number,
  index: number,
  filterIndex: number,
  results: any,
  result: any,
  selectorsCurrent: any
) => {
  // Selectors
  const newSelectorsCurrent = [...selectorsCurrent]
  newSelectorsCurrent[filterIndex] = value
  selectorsCurrent = newSelectorsCurrent

  // Results
  const currentResult: {
    name: string
    number: number
    current?: number
    files?: { name: string; number: number }[]
  } = { ...results[index], current: value }
  results = [
    ...results.slice(0, index),
    currentResult,
    ...results.slice(index + 1)
  ]

  // Update visualization
  if (result) {
    const currentFile = currentResult.files.find(
      (file) => file.name === result.name && file.number === value
    )
    if (currentFile) result = currentFile
  }

  return {
    results: results,
    result: result,
    selectorsCurrent: selectorsCurrent
  }
}
export { setupSelector, resultManager }
