/** @module Components.Project.Simulation.Initialization */

import {
  useState,
  useCallback,
  useMemo,
  Dispatch,
  useContext,
  ReactNode
} from 'react'
import { Card, Layout, Select, Space, Spin, Typography } from 'antd'

import { IModelInitializationDirectChild, IModelRun } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationTask
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'
import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Formula from '@/components/assets/formula'
import {
  getFilesNumbers,
  getMultiplicator,
  separateFiles
} from '@/components/project/simulation/run/results/tools'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Custom Types
 */
export type TInitializationKey = 'none' | 'coupling' | 'direct'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulations: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>[]
  simulation: Simulation
  swr: Swr
}

export interface IDirectItemProps {
  simulation: Simulation
  child: IModelInitializationDirectChild
  index: number
  value: string | undefined
  swr: Swr
  dispatch: Dispatch<INotificationAction>
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
export const _onSelectorChange = async (
  simulation: Simulation,
  key: TInitializationKey,
  swr: Swr
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * On coupling change
 * @param simulation Simulation
 * @param value Value
 * @param swr SWR
 */
export const _onCouplingChange = async (
  simulations: Simulation[],
  simulation: Simulation,
  value: string,
  swr: Swr
): Promise<void> => {
  // Check results
  const results = await _loadResults(simulations, value)

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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * On coupling result change
 * @param simulation Simulation
 * @param value Value
 * @param option Option
 * @param swr SWR
 */
export const _onCouplingResultChange = async (
  simulation: Simulation,
  value: string,
  option: { file: string },
  swr: Swr
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * On parameter change
 * @param index Child index
 * @param value Value
 */
export const _onChange = async (
  simulation: Simulation,
  index: number,
  value: string,
  swr: Swr
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * Get files with filter
 * @param files Files
 * @param filter Filter
 * @returns Filtered / Non-filtered files
 */
const getFilesWithFilter = (
  files: NonNullable<IFrontSimulationTask['files']>,
  filter: NonNullable<IModelRun['resultsFilter']>
): {
  filteredFiles: { fileName: string; number: number }[]
  notFilteredFiles: NonNullable<IFrontSimulationTask['files']>
} => {
  const { filteredFiles, notFilteredFiles } = separateFiles(files, filter)

  // Numbering
  const filesWithNumbers = getFilesNumbers(filteredFiles, filter)
  const uniqueFilesWithNumbers = filesWithNumbers
    .map((file) => {
      let suffixes: RegExp[] = []
      if (Array.isArray(filter.suffixPattern))
        suffixes = filter.suffixPattern.map((pattern) => new RegExp(pattern))
      else suffixes = [new RegExp(filter.suffixPattern)]
      let fileNameWithoutSuffix = file.fileName
      suffixes.forEach(
        (pattern) =>
          (fileNameWithoutSuffix = fileNameWithoutSuffix.replace(pattern, ''))
      )
      return {
        number: file.number,
        fileName: fileNameWithoutSuffix
      }
    })
    .filter(
      (file, index, self) =>
        self.findIndex((s) => s.number === file.number) === index
    )
    .sort((a, b) => a.number - b.number)

  return {
    filteredFiles: uniqueFilesWithNumbers,
    notFilteredFiles
  }
}

/**
 * Load results
 * @param simulations Simulations
 * @param id Simulation id
 */
export const _loadResults = async (
  simulations: Simulation[],
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
        const { filteredFiles, notFilteredFiles } = getFilesWithFilter(
          task.files,
          filter
        )

        // Multiplicator
        const multiplicator = getMultiplicator(configuration, filter)

        // Options
        const options = filteredFiles.map((file, index) => {
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
 * DirectItem
 * @param props Props
 * @returns DirectItem
 */
const DirectItem: React.FunctionComponent<IDirectItemProps> = ({
  simulation,
  child,
  index,
  value,
  swr,
  dispatch
}) => {
  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: string): void => {
      asyncFunctionExec(async () => {
        try {
          await _onChange(simulation, index, value, swr)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, index, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <Formula
      label={child.label}
      defaultValue={(value ?? child.default).toString()}
      units={child.units}
      unit={child.unit}
      onValueChange={onChange}
    />
  )
}

/**
 * Initialization
 * @param props Props
 */
const Initialization: React.FunctionComponent<IProps> = ({
  simulations,
  simulation,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)
  const [currentKey, setCurrentKey] = useState<TInitializationKey>()
  const [couplingSimulation, setCouplingSimulation] = useState<Simulation>()
  const [couplingResults, setCouplingResults] =
    useState<{ label: string; value: string; file: string }[]>()

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Sub scheme
  const subScheme = useMemo(
    () => simulation?.scheme.configuration.initialization!,
    [simulation]
  )

  // Dimension
  const dimension = useMemo(
    () => simulation?.scheme.configuration.dimension,
    [simulation]
  )

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
  useCustomEffect(
    () => {
      if (!currentKey && subScheme.value) setCurrentKey(subScheme.value.type)

      if (!couplingSimulation && subScheme.value?.simulation)
        setSimulation(subScheme.value?.simulation)
    },
    [subScheme, currentKey, couplingSimulation],
    [setSimulation]
  )

  // Results
  useCustomEffect(() => {
    asyncFunctionExec(async () => {
      if (couplingSimulation) {
        const results = await _loadResults(simulations, couplingSimulation.id)
        setCouplingResults(results)
      }
    })
  }, [simulations, couplingSimulation])

  // Build selector
  const selectorOptions = useMemo(() => {
    const options = [
      {
        label: 'None',
        value: 'none'
      }
    ]

    if (subScheme['coupling'])
      options.push({
        label: subScheme['coupling'].label,
        value: 'coupling'
      })

    if (subScheme['direct'])
      options.push({
        label: subScheme['direct'].label,
        value: 'direct'
      })

    return options
  }, [subScheme])

  // Renders
  const initializationValue = subScheme.value

  /**
   * On coupling change
   * @param value Value
   */
  const onCouplingChange = useCallback(
    (value: string): void => {
      asyncFunctionExec(async () => {
        setLoading(true)
        try {
          await _onCouplingChange(simulations, simulation, value, swr)
          setSimulation(value)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        } finally {
          setLoading(false)
        }
      })
    },
    [simulations, simulation, swr, setSimulation, dispatch]
  )

  /**
   * On coupling result change
   * @param value Value
   * @param option Option
   */
  const onCouplingResultChange = useCallback(
    (
      value: string,
      option:
        | { label: string; value: string; file: string }
        | { label: string; value: string; file: string }[]
        | undefined
    ): void => {
      asyncFunctionExec(async () => {
        try {
          await _onCouplingResultChange(
            simulation,
            value,
            (option ?? {}) as { label: string; value: string; file: string },
            swr
          )
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, swr, dispatch]
  )

  /**
   * Render coupling
   * @param options Options
   * @param filter Filter
   * @returns Render
   */
  const renderCoupling = useCallback(
    (
      options: { label: string; value: string; disabled: boolean }[],
      filter?: any
    ): ReactNode => (
      <>
        <Typography.Text>
          If you use coupling, the selected simulation mesh will be used, at
          least for the first iteration.
        </Typography.Text>
        <Space
          direction="vertical"
          className={globalStyle.fullWidth}
          style={{ marginTop: '10px' }}
        >
          <Select
            className={globalStyle.fullWidth}
            options={options}
            placeholder="Select a simulation"
            value={initializationValue?.simulation}
            onChange={onCouplingChange}
          />
          {loading && <Spin />}
          {couplingResults?.length ? (
            <>
              <Typography.Text key={'simulation'}>
                {filter?.name}:
              </Typography.Text>
              <Select
                className={globalStyle.fullWidth}
                options={couplingResults}
                placeholder={'Select a ' + filter.name}
                value={initializationValue?.result}
                onChange={onCouplingResultChange}
              />
            </>
          ) : (
            <Typography.Text type="danger">
              No results, please select an other simulation.
            </Typography.Text>
          )}
        </Space>
      </>
    ),
    [
      initializationValue,
      couplingResults,
      loading,
      onCouplingChange,
      onCouplingResultChange
    ]
  )

  /**
   * Render direct
   * @param direct Direct
   * @returns Render
   */
  const renderDirect = useCallback(
    (direct: {
      label: string
      children: IModelInitializationDirectChild[]
    }): ReactNode => (
      <Space direction="vertical" className={globalStyle.fullWidth}>
        {direct.children.map((child, index) => {
          if (dimension === 2 && child.only3D) return
          return (
            <DirectItem
              key={child.label}
              simulation={simulation}
              child={child}
              index={index}
              value={initializationValue?.values?.[index]}
              swr={swr}
              dispatch={dispatch}
            />
          )
        })}
      </Space>
    ),
    [initializationValue, dimension, simulation, swr, dispatch]
  )

  // Build initialization
  const initializations = useMemo(() => {
    const data: {
      none: ReactNode
      coupling?: ReactNode
      direct?: ReactNode
    } = { none: <div /> }

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

      data['coupling'] = renderCoupling(simulationsOptions, filter)
    }

    // Direct
    const direct = subScheme['direct']
    if (direct?.children) {
      data['direct'] = renderDirect(direct)
    }

    return data
  }, [
    simulations,
    simulation,
    couplingSimulation,
    subScheme,
    renderCoupling,
    renderDirect
  ])

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: TInitializationKey): void => {
      asyncFunctionExec(async () => {
        try {
          await _onSelectorChange(simulation, key, swr)
          setCurrentKey(key)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Select
            className={globalStyle.fullWidth}
            style={{ marginTop: '10px' }}
            defaultValue="none"
            value={currentKey}
            options={selectorOptions}
            onChange={onChange}
          />

          {initializations[currentKey ?? 'none']}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default Initialization
