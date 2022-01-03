import PropTypes from 'prop-types'
import { Button, Form, Input, Space } from 'antd'

import Dialog from '@/components/assets/dialog'

import { IConfiguration } from '../..'
import { DeleteOutlined } from '@ant-design/icons'

export interface IProps {
  visible?: boolean
  boundaryCondition?: IConfiguration['boundaryConditions']['key']
  onOk: Function
  onClose: Function
}

/**
 * Boundary condition
 * @param props Props
 */
const BoundaryCondition = ({
  visible,
  boundaryCondition,
  onOk,
  onClose
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Boundary condition"
      initialValues={boundaryCondition}
      onCancel={onClose}
      onOk={(values: {
        key?: string
        label: string
        refineFactor?: string
        inputs?: IConfiguration['boundaryConditions']['key']['children']
      }) => onOk(values)}
    >
      <Form.Item
        label="Boundary condition name"
        name="label"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Refine factor" name="refineFactor">
        <Input />
      </Form.Item>
      <Form.List name="inputs" initialValue={boundaryCondition?.children}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Space>
                  Input {name + 1}
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </Space>

                <Form.Item
                  {...restField}
                  label="Label"
                  name={[name, 'label']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Default value"
                  name={[name, 'default']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Unit"
                  name={[name, 'unit']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
            <Button onClick={() => add()}>Add input</Button>
          </>
        )}
      </Form.List>
    </Dialog>
  )
}

BoundaryCondition.propTypes = {
  visible: PropTypes.bool,
  BoundaryCondition: PropTypes.exact({
    key: PropTypes.string,
    label: PropTypes.string.isRequired,
    refineFactor: PropTypes.string,
    children: PropTypes.array
  }),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default BoundaryCondition
