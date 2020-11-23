import { useState, useEffect } from 'react'
import { Card, Collapse, Layout, Select } from 'antd'

import Formula from '../../../assets/formula'

import { update, useSimulations } from '../../../../../src/api/simulation'

const Parameters = ({ project, simulation }) => {
  // State
  const [values, setValues] = useState({})

  // Data
  const subScheme = simulation?.scheme.configuration.parameters
  const [, { mutateOneSimulation }] = useSimulations(project?.simulations)

  // Effect
  useEffect(() => {
    const newSimulation = { ...simulation }

    // Update local
    Object.keys(values).forEach((key) => {
      const deepValues = values[key]
      deepValues.forEach((value, index) => {
        if (value)
          newSimulation.scheme.configuration.parameters[key].children[
            index
          ].value = value
      })
    })

    // TODO set this one async

    // Diff
    const diff = {
      ...newSimulation.scheme.configuration.parameters,
      done: true
    }

    // Update
    update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'diff',
        path: ['configuration', 'parameters'],
        value: diff
      }
    ]).then(() => {
      // Mutate
      mutateOneSimulation(newSimulation)
    })
  }, [values])

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

  // Build parameters
  const parameters = []
  const advanced = []
  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key == 'done') return

    const parameter = subScheme[key]

    const components = parameter?.children.map((child, index) => {
      if (child.htmlEntity === 'formula') {
        return (
          <div key={key + '&' + index}>
            {child.label}:
            <Formula
              value={child.value === undefined ? child.default : child.value}
              onChange={(value) => onChange(key, index, value)}
            />
          </div>
        )
      } else if (child.htmlEntity === 'select') {
        return (
          <div key={key + '&' + index}>
            {child.label}:
            <Select
              options={child.options}
              defaultValue={child.value || child.default}
              onChange={(value) => onChange(key, index, value)}
            />
          </div>
        )
      }
    })

    if (parameter?.advanced) {
      advanced.push(
        <Card key={key} title={parameter?.label}>
          {components}
        </Card>
      )
    } else {
      parameters.push(
        <Card key={key} title={parameter?.label}>
          {components}
        </Card>
      )
    }
  })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {parameters}
        <Collapse>
          <Collapse.Panel header="Advanced">{advanced}</Collapse.Panel>
        </Collapse>
      </Layout.Content>
    </Layout>
  )
}

export default Parameters
