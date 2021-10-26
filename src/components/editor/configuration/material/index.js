import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

import Dialog from '@/components/assets/dialog'

const existingMaterialSymbols = ['Rho', 'Mu'] // must match the material database

const Material = ({ visible, material, onOk, onClose }) => {
  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Material"
      initialValues={material}
      onCancel={onClose}
      onOk={(values) => {
        onOk({
          index: material?.index,
          ...values
        })
        onClose()
      }}
    >
      <Form.Item
        label="Label"
        name="label"
        tooltip="Example: «Density»"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Symbol" name="symbol" rules={[{ required: true }]}>
        <Select>
          {existingMaterialSymbols.map((m) => (
            <Select.Option key={m}>{m}</Select.Option>
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
    </Dialog>
  )
}

Material.propTypes = {
  visible: PropTypes.bool.isRequired,
  material: PropTypes.exact({
    index: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired
  }),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Material
