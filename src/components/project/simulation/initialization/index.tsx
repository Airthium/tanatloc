/** @module Components.Project.Simulation.Initialization */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
import { Card, Collapse, Layout, Select, Space, Spin, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import {
  IModelInitialization,
  IModelInitializationCoupling,
  IModelInitializationValue
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
 * On panel change
 * @param simulation Simulation
 * @param key Key
 * @param swr SWR
 */
const onPanelChange = async (
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
      ...initialization.value,
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
 * @param {number} index Children index
 * @param {string} value Value
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
    initialization.value = {
      ...initialization.value,
      values: [
        ...(initialization.value.values?.slice(0, index) || []),
        value,
        ...(initialization.value.values?.slice(index + 1) || [])
      ]
    }

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
  const tasks = await SimulationAPI.tasks({ id })

  const currentSimulation = simulations.find((s) => s.id === id)
  const configuration = currentSimulation.scheme.configuration
  const filter = configuration?.run?.resultsFilter

  const results = []
  tasks.forEach((task) => {
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
        const notFilteredFiles = task.files.filter(
          (file) => !pattern.test(file.fileName)
        )
        const filteredFiles = task.files.filter((file) =>
          pattern.test(file.fileName)
        )

        // Numbering
        const filesWithNumbers = getFilesNumbers(filteredFiles, filter)
        const numbers = filesWithNumbers
          .map((file) => file.number)
          .filter((n, i, s) => s.indexOf(n) === i)
          .sort((a, b) => a - b)

        // Multiplicator
        const multiplicator = getMultiplicator(configuration, filter)

        // Options
        const options = numbers.map((n, i) => {
          const value = multiplicator ? n * multiplicator : i
          const floatingPointFix = Math.round(value * 1e15) / 1e15
          return {
            label: floatingPointFix,
            value: n,
            file: filesWithNumbers[i].fileName.replace(
              new RegExp(filter.suffixPattern),
              ''
            )
          }
        })

        // Add to results
        results.push(
          ...notFilteredFiles
            .map((file) => {
              if (file.type === 'result')
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
    if (task.file) {
      if (task.file.type === 'result')
        results.push({
          label: task.file.fileName,
          value: task.file.fileName,
          file: task.file.fileName
        })
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
  let content = {
    Velocity: null,
    Coupling: null,
    None: null
  }

  // Data
  const subScheme = simulation?.scheme.configuration.initialization

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
        | IModelInitialization
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

  // const initializationValue = subScheme.value
  // console.log(initializationValue)
  // Object.keys(subScheme).forEach((key) => {
  //   if (key === 'index' || key === 'title' || key === 'done' || key === 'value')
  //     return

  //   const initialization = subScheme[key]

  //   if (key === 'coupling') {
  //     const couplingInitialization =
  //       initialization as IModelInitializationCoupling

  //     const simulationsOptions = simulations.map((s) => {
  //       let disabled = false
  //       if (s.id === simulation.id) disabled = true
  //       if (
  //         !couplingInitialization.compatibility.find(
  //           (c) => c.algorithm === s.scheme.algorithm
  //         )
  //       )
  //         disabled = true
  //       return { label: s.name, value: s.id, disabled }
  //     })

  //     const compatibility = couplingInitialization.compatibility.find(
  //       (c) => c.algorithm === couplingSimulation?.scheme?.algorithm
  //     )

  //     const filter = compatibility?.filter

  //     content = {
  //       ...content,
  //       Coupling: (
  //         <Card key={key} title={couplingInitialization?.label}>
  //           <Typography.Text>
  //             If you use coupling, the selected simulation mesh will be used, at
  //             least for the first iteration.
  //           </Typography.Text>
  //           <Space direction="vertical" className="full-width marginTop-10">
  //             <Select
  //               className="full-width"
  //               options={simulationsOptions}
  //               placeholder="Select a simulation"
  //               defaultValue={initializationValue?.simulation}
  //               onChange={async (value: string) => {
  //                 setLoading(true)
  //                 try {
  //                   await onCouplingChange(simulations, simulation, value, swr)
  //                   setSimulation(value)
  //                 } catch (err) {
  //                 } finally {
  //                   setLoading(false)
  //                 }
  //               }}
  //             />
  //             {loading && <Spin />}
  //             {couplingResults?.length ? (
  //               <>
  //                 <Typography.Text key={'simulation'}>
  //                   {filter?.name}:
  //                 </Typography.Text>
  //                 <Select
  //                   options={couplingResults}
  //                   placeholder={'Select a ' + filter.name}
  //                   defaultValue={initializationValue?.result}
  //                   onChange={async (
  //                     value: string,
  //                     option: { label: string; value: string; file: string }
  //                   ) => onCouplingResultChange(simulation, value, option, swr)}
  //                 />
  //               </>
  //             ) : (
  //               <Typography.Text type="danger">
  //                 No results, please select an other simulation.
  //               </Typography.Text>
  //             )}
  //           </Space>
  //         </Card>
  //       )
  //     }
  //   } else {
  //     const valueInitialization = initialization as {
  //       label: string
  //       children: IModelInitialization[]
  //     }

  //     const components = valueInitialization?.children.map(
  //       (child: IModelInitialization, index: number) => {
  //         if (child.htmlEntity === 'formula') {
  //           return (
  //             <Formula
  //               key={key + '&' + index}
  //               label={child.label}
  //               defaultValue={
  //                 initializationValue?.values?.[index] ||
  //                 ((child?.value as string) ?? (child.default as string))
  //               }
  //               onValueChange={async (value) => {
  //                 try {
  //                   await onChange(simulation, index, value, swr)
  //                 } catch (err) {}
  //               }}
  //               unit={child.unit}
  //             />
  //           )
  //         } else if (child.htmlEntity === 'select') {
  //           return (
  //             <Typography.Text key={key + '&' + index}>
  //               {child.label}:<br />
  //               <Select
  //                 options={child.options}
  //                 defaultValue={child?.value ?? child.default}
  //                 onChange={async (value: string) => {
  //                   try {
  //                     await onChange(simulation, index, value, swr)
  //                   } catch (err) {}
  //                 }}
  //               />
  //             </Typography.Text>
  //           )
  //         }
  //       }
  //     )

  //     content = {
  //       ...content,
  //       Velocity: (
  //         <Card key={key} title={valueInitialization?.label}>
  //           <Space direction="vertical" className="full-width">
  //             {components}
  //           </Space>
  //         </Card>
  //       )
  //     }
  //   }
  // })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Select
            style={{ width: '100%' }}
            defaultValue="none"
            value={currentKey}
            options={selectorOptions}
            onChange={async (key) => {
              try {
                await onPanelChange(simulation, key, swr)
                setCurrentKey(key)
              } catch (err) {}
            }}
          />

          {Object.entries(content).map(([key, value]) => {
            return key === currentKey && value
          })}
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
