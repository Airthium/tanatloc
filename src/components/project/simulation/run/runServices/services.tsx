import { ISimulation } from '@/database/index.d'

function checkInProgressTasks(
  currentSimulation: ISimulation,
  setRunning: Function
) {
  try {
    if (currentSimulation.tasks.find((t) => t?.status === 'error')) {
      setRunning(false)
    } else if (currentSimulation.tasks.find((t) => t?.status !== 'finish')) {
      setRunning(true)
    } else setRunning(false)
  } catch (error) {
    setRunning(false)
  }
}

function getUniqueNumbers(filteredFiles, filter) {
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
    numbers: files
      .sort((a, b) => a.number - b.number)
      .map((file) => file.number)
      .filter((value, i, self) => self.indexOf(value) === i)
  }
}

function setMultiplicator(filter, configuration) {
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

export { checkInProgressTasks, getUniqueNumbers, setMultiplicator }
