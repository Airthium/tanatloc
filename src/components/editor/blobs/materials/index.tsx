import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { availableSymbols } from '@/config/materials'

export interface IProps {
  onAdd: (
    values: { label: string; name: string; default: string; unit: string }[]
  ) => void
}

const Materials = ({ onAdd }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Materials"
        visible={visible}
        onOk={async (values) => {
          const materials = values.materials.map(
            (material: { symbol: number; default: string }) => {
              const symbol = availableSymbols[material.symbol]
              const label = symbol.label
              const name = symbol.symbol
              const unit = symbol.unit
              return { label, name, default: material.default, unit }
            }
          )
          onAdd(materials)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        <Form.List name="materials">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={
                    <div>
                      <MinusCircleOutlined
                        style={{
                          fontSize: '16px',
                          color: 'red',
                          marginRight: '10px'
                        }}
                        onClick={() => remove(field.name)}
                      />
                      Material {index + 1}
                    </div>
                  }
                >
                  <Form.Item
                    name={[field.name, 'symbol']}
                    label="Physical parameter"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={availableSymbols.map((symbol, sindex) => ({
                        label: symbol.symbol + ': ' + symbol.label,
                        value: sindex
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'default']}
                    label="Default"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add material
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Materials
      </Button>
    </>
  )
}

export default Materials
