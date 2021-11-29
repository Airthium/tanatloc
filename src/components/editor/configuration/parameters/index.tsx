import PropTypes from 'prop-types'
import { Button, Form, Input, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { IConfiguration } from '../..'

export interface IProps {
  visible?: boolean
  parameters?: IConfiguration['parameters']['key']
  onOk: Function
  onClose: Function
}

/**
 * Parameters
 * @param props Props
 */
const Parameters = ({
  visible,
  parameters,
  onOk,
  onClose
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Parameters"
      initialValues={parameters}
      onCancel={onClose}
      onOk={(values: {
        key?: string
        label: string
        parameters: IConfiguration['parameters']['key']['children']
      }) => {
        console.log(values)
        try {
          onOk(values)
        } catch (err) {}
      }}
    >
      <Form.Item
        label="Parameters group name"
        name="label"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.List name="parameters" initialValue={parameters?.children}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div key={key}>
                <Space>
                  Parameters {name + 1}
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
                  fieldKey={[fieldKey, 'label']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Default value"
                  name={[name, 'default']}
                  fieldKey={[fieldKey, 'default']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Unit"
                  name={[name, 'unit']}
                  fieldKey={[fieldKey, 'unit']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
            <Button onClick={() => add()}>Add</Button>
          </>
        )}
      </Form.List>
    </Dialog>
  )
}

Parameters.propTypes = {
  visible: PropTypes.bool.isRequired,
  parameters: PropTypes.exact({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.array
  }),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Parameters
