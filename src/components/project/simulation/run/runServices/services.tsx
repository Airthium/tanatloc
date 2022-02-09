import { IModel } from '@/models/index.d'

type FilteredFileType = { fileName: string }[]
type FilterType = {
  name: string
  prefixPattern: string | RegExp
  suffixPattern: string | RegExp
  pattern: string | RegExp
  multiplicator?: string[]
}

function getUniqueNumbers(filteredFiles: FilteredFileType, filter: FilterType) {
  const files = filteredFiles.map((file) => {
    const number = file.fileName
      .replace(new RegExp(filter.prefixPattern), '')
      .replace(new RegExp(filter.suffixPattern), '')
    return {
      ...file,
      number: +number
    }
  })

  // Get unique numbers
  return {
    files: files,
    numbers: [...files]
      .sort((a, b) => a.number - b.number)
      .map((file) => file.number)
      .filter((value, i, self) => self.indexOf(value) === i)
  }
}

function setMultiplicator(
  filter: FilterType,
  configuration: IModel['configuration']
) {
  // Multiplicator

  const multiplicatorPath = filter.multiplicator
  if (multiplicatorPath) {
    const multiplicatorObject = multiplicatorPath.reduce(
      (a, v) => a[v],
      configuration
    )
    return multiplicatorObject.value || multiplicatorObject.default
  }
}

export { getUniqueNumbers, setMultiplicator }
