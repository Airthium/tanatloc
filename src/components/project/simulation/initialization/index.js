import { useState } from 'react'
import { Collapse, Layout, Select, Space, Spin, Typography } from 'antd'

import Formula from '@/components/assets/formula'

import SimulationAPI from '@/api/simulation'

const Initialization = ({ simulations, simulation }) => {
  // State
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({})
  const [couplingSimulation, setCouplingSimulation] = useState()
  const [couplingResults, setCouplingResults] = useState()

  // Data
  const subScheme = simulation?.scheme.configuration.initialization

  const onPanelChange = (key) => {
    console.log(key)
  }

  const onCouplingChange = async (value) => {
    setLoading(true)

    // Simulation
    const simulationToCouple = simulations.find((s) => s.id === value)

    // Results
    const tasks = await SimulationAPI.tasks({ id: simulationToCouple.id })
    const results = tasks.flatMap((task) => {
      const taskResults = []
      if (task.files) {
        const files = task.files
          .filter((file) => file.type === 'result')
          .map((file) => file.fileName)
        taskResults.push(...files)
      }
      if (task.file) {
        if (task.file.type === 'results') taskResults.push(task.file.fileName)
      }

      // Set unique
      return taskResults
        .filter((result, index) => taskResults.indexOf(result) === index)
        .sort()
    })

    setLoading(false)

    setCouplingSimulation(simulationToCouple)
    setCouplingResults(results)
  }

  /**
   * On parameter change
   * @param {string} key Parameter key
   * @param {number} index Children index
   * @param {string} value Value
   */
  const onChange = (key, index, value) => {
    const deepValues = values[key] || []
    deepValues[index] = value
    const newValues = {
      ...values,
      [key]: deepValues
    }

    setValues(newValues)
  }

  // Build initialization
  const initializations = []
  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done') return

    const initialization = subScheme[key]

    if (initialization.type === 'SIMULATION_COUPLING') {
      const simulationsOptions = simulations.map((s) => {
        let disabled = false
        if (s.id === simulation.id) disabled = true
        if (
          !initialization.compatibility.find(
            (c) => c.algorithm === s.scheme.algorithm
          )
        )
          disabled = true
        return { label: s.name, value: s.id, disabled }
      })
      const compatibility = initialization.compatibility.find(
        (c) => c.algorithm === couplingSimulation?.scheme?.algorithm
      )
      const filter = compatibility?.filter
      initializations.push(
        <Collapse.Panel key={key} header={initialization?.label}>
          <Typography.Text>
            If you use coupling, the selected simulation mesh will be used, at
            least for the first iteration.
          </Typography.Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              options={simulationsOptions}
              placeholder="Select a simulation"
              onChange={onCouplingChange}
            />
            {loading && <Spin />}
            {couplingResults?.length === 0 && (
              <Typography.Text type="warning">
                No results, please select an other simulation.
              </Typography.Text>
            )}
            {couplingResults?.length > 1 && (
              <>
                <Typography.Text key={'simulation'}>
                  {filter?.name}:
                </Typography.Text>
                <Select
                  options={couplingResults.map((result) => ({
                    value: result,
                    label: result
                  }))}
                  defaultValue={couplingResults[0]}
                />
              </>
            )}
          </Space>
        </Collapse.Panel>
      )
    } else {
      const components = initialization?.children.map((child, index) => {
        if (child.htmlEntity === 'formula') {
          return (
            <Typography.Text key={key + '&' + index}>
              {child.label}:<br />
              <Formula
                defaultValue={
                  child.value === undefined ? child.default : child.value
                }
                onValueChange={(value) => onChange(key, index, value)}
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
                defaultValue={child.value || child.default}
                onChange={(value) => onChange(key, index, value)}
              />
            </Typography.Text>
          )
        }
      })

      initializations.push(
        <Collapse.Panel key={key} header={initialization?.label}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {components}
          </Space>
        </Collapse.Panel>
      )
    }
  })
  return (
    <Layout>
      <Layout.Content>
        <Collapse accordion onChange={onPanelChange}>
          {initializations}
        </Collapse>
      </Layout.Content>
    </Layout>
  )
}

export default Initialization
