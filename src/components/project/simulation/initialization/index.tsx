/** @module Components.Project.Simulation.Initialization */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
import { Card, Layout, Select, Space, Spin, Typography } from 'antd'

import { ISimulation, ISimulationTask } from '@/database/index.d'
import {
  IModelInitialization,
  IModelInitializationCoupling
} from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { ErrorNotification } from '@/components/assets/notification'
import {
  getFilesNumbers,
  getMultiplicator
} from '@/components/project/simulation/run/results/tools'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulations: ISimulation[]
  simulation?: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * On selector change
 * @param simulation Simulation
 * @param key Key
 * @param swr SWR
 */
const onSelectorChange = async (
  simulation: ISimulation,
  key: string,
  swr: IProps['swr']
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization
    initialization.value = {
      type: key
    }

    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'initialization'],
        value: initialization
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * On coupling change
 * @param simulation Simulation
 * @param value Value
 * @param swr SWR
 */
const onCouplingChange = async (
  simulations: ISimulation[],
  simulation: ISimulation,
  value: string,
  swr: IProps['swr']
): Promise<void> => {
  try {
    // Check results
    const results = await loadResults(simulations, value)

    // Update simulation
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization
    initialization.value = {
      ...initialization.value,
      simulation: value,
      result: results?.[0]?.value
    }

    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'initialization'],
        value: initialization
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * On coupling result change
 * @param simulation Simulation
 * @param value Value
 * @param option Option
 * @param swr SWR
 */
const onCouplingResultChange = async (
  simulation: ISimulation,
  value: string,
  option: { file: string },
  swr: IProps['swr']
): Promise<void> => {
  // Update simulation
  try {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization
    initialization.value = {
      ...initialization.value,
      number: +value,
      result: option.file
    }

    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'initialization'],
        value: initialization
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On parameter change
 * @param index Child index
 * @param value Value
 */
const onChange = async (
  simulation: ISimulation,
  index: number,
  value: string,
  swr: IProps['swr']
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization
    if (!initialization.value.values) initialization.value.values = []
    initialization.value.values[index] = value

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'initialization'],
        value: initialization
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Load results
 * @param simulations Simulations
 * @param id Simulation id
 */
const loadResults = async (
  simulations: ISimulation[],
  id: string
): Promise<{ label: string; value: string; file: string }[]> => {
  const tasks: ISimulationTask[] = await SimulationAPI.tasks({ id })

  const currentSimulation = simulations.find((s) => s.id === id)
  const configuration = currentSimulation.scheme.configuration
  const filter = configuration?.run?.resultsFilter

  const results = []
  tasks.forEach((task) => {
    // Check file
    if (task.file) {
      if (task.file.type === 'result')
        results.push({
          label: task.file.fileName,
          value: task.file.fileName,
          file: task.file.fileName
        })
    }

    // Check files
    if (task.files) {
      if (!filter) {
        task.files.forEach((file) => {
          if (file.type === 'result')
            results.push({
              label: file.fileName,
              value: file.fileName,
              file: file.fileName
            })
        })
      } else {
        // Pattern filter
        const pattern = new RegExp(filter.pattern)
        const notFilteredFiles = task.files
          .filter((file) => !pattern.test(file.fileName))
          .filter((file) => file.type === 'result')
        const files = task.files.filter((file) => pattern.test(file.fileName))

        // Numbering
        const filesWithNumbers = getFilesNumbers(files, filter)
        const uniqueFilesWithNumbers = filesWithNumbers
          .map((file) => ({
            number: file.number,
            fileName: file.fileName.replace(
              new RegExp(filter.suffixPattern),
              ''
            )
          }))
          .filter(
            (file, index, self) =>
              self.findIndex((s) => s.number === file.number) === index
          )
          .sort((a, b) => a.number - b.number)

        // Multiplicator
        const multiplicator = getMultiplicator(configuration, filter)

        // Options
        const options = uniqueFilesWithNumbers.map((file, index) => {
          const value = multiplicator ? file.number * multiplicator : index
          const floatingPointFix = Math.round(value * 1e15) / 1e15
          return {
            label: floatingPointFix,
            value: file.fileName,
            file: file.fileName
          }
        })

        // Add to results
        results.push(
          ...notFilteredFiles
            .map((file) => {
              results.push({
                label: file.fileName,
                value: file.fileName,
                file: file.fileName
              })
            })
            .filter((f) => f)
        )
        results.push(
          ...options.map((option) => {
            return {
              label: option.label,
              value: option.value,
              file: option.file
            }
          })
        )
      }
    }
  })

  return results
}

/**
 * Initialization
 * @param props Props
 */
const Initialization = ({
  simulations,
  simulation,
  swr
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [currentKey, setCurrentKey]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState()
  const [couplingSimulation, setCouplingSimulation]: [
    ISimulation,
    Dispatch<SetStateAction<ISimulation>>
  ] = useState()
  const [couplingResults, setCouplingResults]: [
    { label: string; value: string }[],
    Dispatch<SetStateAction<{ label: string; value: string }[]>>
  ] = useState()

  // Data
  const subScheme = simulation?.scheme.configuration.initialization
  const dimension = simulation?.scheme.configuration.dimension

  /**
   * Set simulation
   * @param id Simulation id
   */
  const setSimulation = useCallback(
    (id: string): void => {
      const simulationToCouple = simulations.find((s) => s.id === id)
      setCouplingSimulation(simulationToCouple)
    },
    [simulations]
  )

  // Key
  useEffect(() => {
    if (!currentKey && subScheme?.value) setCurrentKey(subScheme.value.type)

    if (!couplingSimulation && subScheme?.value?.simulation)
      setSimulation(subScheme?.value?.simulation)
  }, [subScheme, currentKey, couplingSimulation, setSimulation])

  // Results
  useEffect(() => {
    if (couplingSimulation)
      loadResults(simulations, couplingSimulation.id).then((results) =>
        setCouplingResults(results)
      )
  }, [simulations, couplingSimulation])

  // Build selector
  const selectorOptions = Object.keys(subScheme)
    .map((key) => {
      if (
        key === 'index' ||
        key === 'title' ||
        key === 'done' ||
        key === 'value'
      )
        return

      const initialization = subScheme[key] as
        | { label: string; children: IModelInitialization[] }
        | IModelInitializationCoupling

      return {
        label: initialization.label,
        value: key
      }
    })
    .filter((s) => s)
  selectorOptions.unshift({
    label: 'None',
    value: 'none'
  })

  // Build initialization
  const initializationValue = subScheme.value
  const initializations = {}

  // Render coupling
  const renderCoupling = (
    options: { label: string; value: string; disabled: boolean }[],
    filter?: any
  ) => (
    <>
      <Typography.Text>
        If you use coupling, the selected simulation mesh will be used, at least
        for the first iteration.
      </Typography.Text>
      <Space direction="vertical" className="full-width marginTop-10">
        <Select
          className="full-width"
          options={options}
          placeholder="Select a simulation"
          value={initializationValue?.simulation}
          onChange={async (value: string) => {
            setLoading(true)
            try {
              await onCouplingChange(simulations, simulation, value, swr)
              setSimulation(value)
            } catch (err) {
            } finally {
              setLoading(false)
            }
          }}
        />
        {loading && <Spin />}
        {couplingResults?.length ? (
          <>
            <Typography.Text key={'simulation'}>
              {filter?.name}:
            </Typography.Text>
            <Select
              className="full-width"
              options={couplingResults}
              placeholder={'Select a ' + filter.name}
              value={initializationValue?.result}
              onChange={async (
                value: string,
                option: { label: string; value: string; file: string }
              ) => onCouplingResultChange(simulation, value, option, swr)}
            />
          </>
        ) : (
          <Typography.Text type="danger">
            No results, please select an other simulation.
          </Typography.Text>
        )}
      </Space>
    </>
  )

  // Render direct
  const renderDirect = (direct: {
    label: string
    children: IModelInitialization[]
  }) => (
    <Space direction="vertical" className="full-width">
      {direct.children.map((child, index) => {
        if (dimension === 2 && child.only3D) return
        return (
          <Formula
            key={index}
            label={child.label}
            defaultValue={(
              initializationValue?.values?.[index] ?? child.default
            ).toString()}
            unit={child.unit}
            onValueChange={(value) => onChange(simulation, index, value, swr)}
          />
        )
      })}
    </Space>
  )

  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done' || key === 'value')
      return

    // Coupling
    const coupling = subScheme[key] as IModelInitializationCoupling
    if (coupling.compatibility) {
      // Simulations
      const simulationsOptions = simulations.map((s) => {
        let disabled =
          s.id === simulation.id ||
          !coupling.compatibility.find(
            (c) => c.algorithm === s.scheme.algorithm
          )

        return { label: s.name, value: s.id, disabled }
      })

      // Compatbility
      const compatibility = coupling.compatibility.find(
        (c) => c.algorithm === couplingSimulation?.scheme?.algorithm
      )

      // Filter
      const filter = compatibility?.filter

      initializations[key] = renderCoupling(simulationsOptions, filter)
    }

    // Direct
    const direct = subScheme[key] as {
      label: string
      children: IModelInitialization[]
    }
    if (direct.children) {
      initializations[key] = renderDirect(direct)
    }
  })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Select
            className="full-width marginBottom-10"
            defaultValue="none"
            value={currentKey}
            options={selectorOptions}
            onChange={async (key) => {
              try {
                await onSelectorChange(simulation, key, swr)
                setCurrentKey(key)
              } catch (err) {}
            }}
          />

          {initializations[currentKey]}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Initialization.propTypes = {
  simulations: PropTypes.array,
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        initialization: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Initialization
