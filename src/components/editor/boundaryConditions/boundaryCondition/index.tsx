import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { AddButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

export interface IProps {
  boundaryCondition?: IConfiguration['boundaryConditions']['key'] & {
    key: string
  }
  onAdd?: (values: IConfiguration['boundaryConditions']['key']) => void
  onEdit?: (values: IConfiguration['boundaryConditions']['key']) => void
}

const BoundaryCondition = ({
  boundaryCondition,
  onAdd,
  onEdit
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  useEffect(() => {
    setVisible(!!boundaryCondition)
  }, [boundaryCondition])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = (values: IConfiguration['boundaryConditions']['key']) => {
    if (boundaryCondition) onEdit(values)
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
  if (visible)
    return (
      <Form
        layout="vertical"
        initialValues={boundaryCondition}
        onFinish={onFinish}
      >
        <Form.Item
          label="Boundary condition name"
          name="label"
          rules={[
            { required: true, message: 'Boundary condition name is required' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Refine factor" name="refineFactor">
          <Input />
        </Form.Item>
        <Form.List name="children">
          {(fields, { add, remove }, { errors }) => (
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
                    rules={[{ required: true, message: 'Label is required' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Default value"
                    name={[name, 'default']}
                    rules={[
                      { required: true, message: 'Default value is required' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Unit"
                    name={[name, 'unit']}
                    rules={[{ required: true, message: 'Unit is required' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                <Button onClick={() => add()}>Add input</Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {boundaryCondition ? 'Edit' : 'Add'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    )
  else
    return (
      <AddButton onAdd={() => setVisible(true)}>
        Add boundary condition
      </AddButton>
    )
}

BoundaryCondition.propTypes = {
  boundaryCondition: PropTypes.object,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func
}

export default BoundaryCondition
