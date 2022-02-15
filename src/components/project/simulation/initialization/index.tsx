import { useState, useEffect } from 'react'
import { Collapse, Layout, Select, Space, Spin, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelInitialization } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { Error as ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulations: ISimulation[]
  simulation?: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Errors (initialization)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update simulation'
}

/**
 * Initialization
 * @memberof Components.Project.Simulation
 * @param props Props
 */
const Initialization = ({
  simulations,
  simulation,
  swr
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)
  const [currentKey, setCurrentKey]: [string, Function] = useState()
  const [values, setValues]: [string[], Function] = useState([])
  const [couplingSimulation, setCouplingSimulation]: [ISimulation, Function] =
    useState()
  const [couplingResults, setCouplingResults]: [
    { label: string; value: string }[],
    Function
  ] = useState()

  // Data
  const subScheme = simulation?.scheme.configuration.initialization

  useEffect(() => {
    if (subScheme?.value) setCurrentKey(subScheme.value.type)
  }, [])

  /**
   * On panel change
   * @param key Key
   */
  const onPanelChange = async (key: string): Promise<void> => {
    setCurrentKey(key)
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
    }
  }

  /**
   * Load results
   * @param {string} id Simulation id
   */
  const loadResults = async (
    id: string
  ): Promise<{ label: string; value: string }[]> => {
    const tasks = await SimulationAPI.tasks({ id })

    const results = []
    tasks.forEach((task) => {
      if (task.files) {
        // Filter
        const currentSimulation = simulations.find((s) => s.id === id)
        const resultsFilters =
          currentSimulation.scheme.configuration.run.resultsFilters

        //Sort by filters
        // Check if no results filters
        //TODO
        resultsFilters?.forEach((filter, filterIndex) => {
          const pattern = new RegExp(filter.pattern)
          const filteredFiles = task.files.filter((file) =>
            pattern.test(file.fileName)
          )

          if (filteredFiles.length) {
            // Set iteration numbers
            const files = filteredFiles.map((file) => {
              const number = file.fileName
                .replace(new RegExp(filter.prefixPattern), '')
                .replace(new RegExp(filter.suffixPattern), '')
              return {
                ...file,
                number: +number
              }
            })

            // Sort
            files.sort((a, b) => a.number - b.number)

            // Get unique numbers
            const steps = files.filter((file, i) => {
              return files.findIndex((s) => s.number === file.number) === i
            })

            // Multiplicator
            let multiplicator

            const multiplicatorPath = filter.multiplicator
            if (multiplicatorPath) {
              const multiplicatorObject = multiplicatorPath.reduce(
                (a, v) => a[v],
                currentSimulation.scheme.configuration
              )
              multiplicator =
                multiplicatorObject.value || multiplicatorObject.default
            }

            results.push(
              ...steps.map((file, i) => ({
                label: (multiplicator
                  ? Math.round(file.number * multiplicator * 1e15) / 1e15
                  : i
                ).toString(),
                value: i,
                file: file.fileName.replace(
                  new RegExp(filter.suffixPattern),
                  ''
                )

                // value:
              }))
            )
          }
        })
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

    setCouplingResults(results)

    return results
  }

  const setSimulation = (id: string): void => {
    const simulationToCouple = simulations.find((s) => s.id === id)
    setCouplingSimulation(simulationToCouple)
  }

  const onCouplingChange = async (value) => {
    setLoading(true)

    // Simulation
    setSimulation(value)

    try {
      // Check results
      const results = await loadResults(value)

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
    }

    setLoading(false)
  }

  const onCouplingResultChange = async (value, option) => {
    // Update simulation
    try {
      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const initialization = newSimulation.scheme.configuration.initialization
      initialization.value = {
        ...initialization.value,
        number: value,
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
  const onChange = async (index, value) => {
    const newValues = [...values]
    newValues[index] = value

    try {
      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const initialization = newSimulation.scheme.configuration.initialization
      initialization.value = {
        ...initialization.value,
        //@ts-ignore
        values: newValues
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

    setValues(newValues)
  }

  // Build initialization
  const initializations = []
  const initializationValue = subScheme.value
  if (
    !couplingSimulation &&
    !couplingResults &&
    initializationValue?.simulation
  ) {
    setSimulation(initializationValue.simulation)
    loadResults(initializationValue.simulation)
  }

  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done' || key === 'value')
      return

    const initialization = subScheme[key]

    if (key === 'coupling') {
      const simulationsOptions = simulations.map((s) => {
        let disabled = false
        if (s.id === simulation.id) disabled = true
        if (
          //@ts-ignore
          !initialization.compatibility.find(
            (c) => c.algorithm === s.scheme.algorithm
          )
        )
          disabled = true
        return { label: s.name, value: s.id, disabled }
      })
      //@ts-ignore
      const compatibility = initialization.compatibility.find(
        (c) => c.algorithm === couplingSimulation?.scheme?.algorithm
      )
      const filter = compatibility?.filter
      initializations.push(
        //@ts-ignore
        <Collapse.Panel key={key} header={initialization?.label}>
          <Typography.Text>
            If you use coupling, the selected simulation mesh will be used, at
            least for the first iteration.
          </Typography.Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              options={simulationsOptions}
              placeholder="Select a simulation"
              defaultValue={initializationValue?.simulation}
              onChange={onCouplingChange}
            />
            {loading && <Spin />}
            {couplingResults?.length ? (
              <>
                <Typography.Text key={'simulation'}>
                  {filter?.name}:
                </Typography.Text>
                <Select
                  options={couplingResults}
                  placeholder={'Select a ' + filter.name}
                  defaultValue={initializationValue?.result}
                  onChange={onCouplingResultChange}
                />
              </>
            ) : (
              <Typography.Text type="warning">
                No results, please select an other simulation.
              </Typography.Text>
            )}
          </Space>
        </Collapse.Panel>
      )
    } else {
      //@ts-ignore
      const components = initialization?.children.map(
        (child: IModelInitialization, index: number) => {
          if (child.htmlEntity === 'formula') {
            return (
              <Typography.Text key={key + '&' + index}>
                {child.label}:<br />
                <Formula
                  defaultValue={
                    //@ts-ignore
                    initializationValue?.values?.[index] ||
                    (child?.value ?? child.default)
                  }
                  onValueChange={(value) => onChange(index, value)}
                  unit={child.unit}
                />
              </Typography.Text>
            )
          } else if (child.htmlEntity === 'select') {
            return (
              <Typography.Text key={key + '&' + index}>
                {child.label}:<br />
                <Select
                  options={child.options}
                  //@ts-ignore
                  defaultValue={child?.value ?? child.default}
                  onChange={(value) => onChange(index, value)}
                />
              </Typography.Text>
            )
          }
        }
      )

      initializations.push(
        //@ts-ignore
        <Collapse.Panel key={key} header={initialization?.label}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {components}
          </Space>
        </Collapse.Panel>
      )
    }
  })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Collapse accordion onChange={onPanelChange} activeKey={currentKey}>
          {initializations}
        </Collapse>
      </Layout.Content>
    </Layout>
  )
}

export default Initialization
