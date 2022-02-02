import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { AddButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

export interface IProps {
  parameter?: IConfiguration['parameters']['key'] & { key: string }
  onAdd?: (values: IConfiguration['parameters']['key']) => void
  onEdit?: (values: IConfiguration['parameters']['key']) => void
}

const Parameter = ({ parameter, onAdd, onEdit }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)

  useEffect(() => {
    setVisible(!!parameter)
  }, [parameter])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = (values: IConfiguration['parameters']['key']) => {
    if (parameter) onEdit(values)
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
   * Validator
   * @param _ Unused
   * @param value Value
   * @returns Promise
   */
  const validator = (
    _: any,
    value: IConfiguration['parameters']['key']['children']
  ) => {
    if (!value?.length) return Promise.reject(new Error('Options are required'))
    return Promise.resolve()
  }

  /**
   * Render
   */
  if (visible)
    return (
      <Form layout="vertical" initialValues={parameter} onFinish={onFinish}>
        <Form.Item
          label="Parameter name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.List name="children" rules={[{ validator }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
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
                    label="Name"
                    name={[name, 'name']}
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
              <Form.Item>
                <Button
                  className={!fields.length && 'required'}
                  onClick={() => add()}
                >
                  Add parameter
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {parameter ? 'Edit' : 'Add'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    )
  else
    return <AddButton onAdd={() => setVisible(true)}>Add parameter</AddButton>
}

Parameter.propTypes = {
  parameter: PropTypes.exact({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func
}

export default Parameter
