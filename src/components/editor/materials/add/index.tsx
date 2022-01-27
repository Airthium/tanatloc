import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'

import { AddButton } from '@/components/assets/button'

const existingMaterialSymbols = ['Rho', 'Mu'] // must match the material database

const Add = ({ onAdd }) => {
  // State
  const [hidden, setHidden] = useState(true)

  const onFinish = (values) => {
    onAdd(values)
    setHidden(true)
  }

  return (
    <>
      <AddButton disabled={!hidden} onAdd={() => setHidden(false)}>
        Add material
      </AddButton>
      <Form layout="vertical" onFinish={onFinish} hidden={hidden}>
        <Form.Item
          label="Label"
          name="label"
          tooltip="Example: «Density»"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Symbol"
          name="symbol"
          tooltip="The symbol must match the material database definition"
          rules={[{ required: true }]}
        >
          <Select>
            {existingMaterialSymbols.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Default value"
          name="default"
          tooltip="Example: 1e3"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Unit"
          name="unit"
          tooltip="LaTeX friendly, example: kg.m^{-3}"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Add
