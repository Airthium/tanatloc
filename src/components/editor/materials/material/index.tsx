import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Button, Form, Input, Select } from 'antd'

import { AddButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

const existingMaterialSymbols = ['Rho', 'Mu'] // must match the material database

export interface IProps {
  material?: IConfiguration['materials']['children'][0] & { index: number }
  onAdd?: (values: IConfiguration['materials']['children'][0]) => void
  onEdit?: (values: IConfiguration['materials']['children'][0]) => void
}

/**
 * Material
 * @param props Props
 */
const Material = ({ material, onAdd, onEdit }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!!material)
  }, [material])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = (values: IConfiguration['materials']['children'][0]) => {
    if (material) onEdit(values)
    else onAdd(values)

    setVisible(false)
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    setVisible(false)
  }

  /**
   * Render
   */
  return visible ? (
    <Form layout="vertical" initialValues={material} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
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
          {material ? 'Edit' : 'Add'}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Form.Item>
    </Form>
  ) : (
    <AddButton onAdd={() => setVisible(true)}>Add material</AddButton>
  )
}

Material.propTypes = {
  material: PropTypes.exact({
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    default: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    unit: PropTypes.string.isRequired
  }),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func
}

export default Material
