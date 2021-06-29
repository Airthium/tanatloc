import { useState } from 'react'
import { Collapse, Layout, Select, Space, Typography } from 'antd'

import Formula from '@/components/assets/formula'

const Initialization = ({ simulations, simulation }) => {
  // State
  const [values, setValues] = useState({})

  // Data
  const subScheme = simulation?.scheme.configuration.initialization

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
        let options
        if (child.options === 'SIMULATIONS_LIST') {
          options = simulations.map((s) => ({ label: s.name, value: s.id }))
        } else {
          options = child?.options || []
        }
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Select
              options={options}
              defaultValue={options[0]?.value}
              onChange={(value) => onChange(key, index, value)}
            />
          </Typography.Text>
        )
      }
    })

    initializations.push(
      <Collapse.Panel key={key} header={initialization?.label}>
        <Space direction="vertical">{components}</Space>
      </Collapse.Panel>
    )
  })
  return (
    <Layout>
      <Layout.Content>
        <Collapse accordion>{initializations}</Collapse>
      </Layout.Content>
    </Layout>
  )
}

export default Initialization
