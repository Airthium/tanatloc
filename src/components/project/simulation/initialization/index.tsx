/** @module Components.Project.Simulation.Initialization */

import { useState, useEffect, useCallback } from 'react'
import { Card, Layout, Select, Space, Spin, Typography } from 'antd'

import { IModelInitializationDirectChild } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { ErrorNotification } from '@/components/assets/notification'
import {
  getFilesNumbers,
  getMultiplicator
} from '@/components/project/simulation/run/results/tools'

import Utils from '@/lib/utils'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationTask
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Custom Types
 */
export type TInitializationKey = 'none' | 'coupling' | 'direct'

/**
 * Props
 */
export interface IProps {
  simulations: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  key: TInitializationKey,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization!
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
  simulations: Pick<IFrontSimulationsItem, 'id' | 'scheme'>[],
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  value: string,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // Check results
    const results = await loadResults(simulations, value)

    // Update simulation
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization!
    initialization.value = {
      ...initialization.value!,
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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  value: string,
  option: { file: string },
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  // Update simulation
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization!
    initialization.value = {
      ...initialization.value!,
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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  index: number,
  value: string,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const initialization = newSimulation.scheme.configuration.initialization!
    if (!initialization.value!.values) initialization.value!.values = []
    initialization.value!.values[index] = value

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
  simulations: Pick<IFrontSimulationsItem, 'id' | 'scheme'>[],
  id: string
): Promise<{ label: string; value: string; file: string }[]> => {
  const tasks: IFrontSimulationTask[] = await SimulationAPI.tasks({ id })

  const currentSimulation = simulations.find((s) => s.id === id)
  const configuration = currentSimulation!.scheme.configuration
  const filter = configuration?.run?.resultsFilter

  const results: { label: string; value: string; file: string }[] = []
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
            label: String(floatingPointFix),
            value: file.fileName,
            file: file.fileName
          }
        })

        // Add to results
        results.push(
          ...notFilteredFiles
            .map((file) => ({
              label: file.fileName,
              value: file.fileName,
              file: file.fileName
            }))
            .filter((f) => f)
        )
        results.push(...options)
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
  const [loading, setLoading] = useState<boolean>(false)
  const [currentKey, setCurrentKey] = useState<TInitializationKey>()
  const [couplingSimulation, setCouplingSimulation] =
    useState<Pick<IFrontSimulationsItem, 'id' | 'scheme'>>()
  const [couplingResults, setCouplingResults] =
    useState<{ label: string; value: string; file: string }[]>()

  // Data
  const subScheme = simulation?.scheme.configuration.initialization!
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
    if (!currentKey && subScheme.value) setCurrentKey(subScheme.value.type)

    if (!couplingSimulation && subScheme.value?.simulation)
      setSimulation(subScheme.value?.simulation)
  }, [subScheme, currentKey, couplingSimulation, setSimulation])

  // Results
  useEffect(() => {
    if (couplingSimulation)
      loadResults(simulations, couplingSimulation.id).then((results) =>
        setCouplingResults(results)
      )
  }, [simulations, couplingSimulation])

  // Build selector
  const selectorOptions = [
    {
      label: 'None',
      value: 'none'
    }
  ]

  if (subScheme['coupling'])
    selectorOptions.push({
      label: subScheme['coupling'].label,
      value: 'coupling'
    })

  if (subScheme['direct'])
    selectorOptions.push({
      label: subScheme['direct'].label,
      value: 'direct'
    })

  // Build initialization
  const initializations: {
    none: JSX.Element
    coupling?: JSX.Element
    direct?: JSX.Element
  } = {
    none: <div />
  }
  const initializationValue = subScheme.value

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
              onChange={async (value, option) => {
                onCouplingResultChange(
                  simulation,
                  value,
                  option as { label: string; value: string; file: string },
                  swr
                )
              }}
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
    children: IModelInitializationDirectChild[]
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

  {
    // Coupling
    const coupling = subScheme['coupling']
    if (coupling?.compatibility) {
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

      initializations['coupling'] = renderCoupling(simulationsOptions, filter)
    }

    // Direct
    const direct = subScheme['direct']
    if (direct?.children) {
      initializations['direct'] = renderDirect(direct)
    }
  }

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
            onChange={async (key: TInitializationKey) => {
              try {
                await onSelectorChange(simulation, key, swr)
                setCurrentKey(key)
              } catch (err) {}
            }}
          />

          {initializations[currentKey || 'none']}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default Initialization
