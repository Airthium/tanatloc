import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Divider, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { IConfiguration } from '../'

export interface IProps {
  configuration: IConfiguration
  onNext: (values: {
    name: string
    category: string
    description: string
  }) => void
}

// TODO get real data
const existingCategories = ['Academic', 'Fluid', 'Mechanics']

/**
 * Information
 * @memberof Components.Editor
 */
const Information = ({ configuration, onNext }: IProps): JSX.Element => {
  // State
  const [category, setCategory]: [string, Function] = useState()

  /**
   * Render
   */
  return (
    <Form
      layout="vertical"
      labelCol={{ offset: 4, span: 16 }}
      wrapperCol={{ offset: 4, span: 16 }}
      initialValues={configuration}
      onFinish={onNext}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select
          placeholder={'Select or add a category'}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  padding: 8
                }}
              >
                <Input
                  style={{ flex: 'auto' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <a
                  style={{
                    flex: 'none',
                    padding: '8px',
                    display: 'block',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    existingCategories.push(category)
                    setCategory()
                  }}
                >
                  <PlusOutlined /> Add item
                </a>
              </div>
            </div>
          )}
        >
          {existingCategories.map((c) => (
            <Select.Option key={c} value={c}>
              {c}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}

Information.propTypes = {
  configuration: PropTypes.exact({
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default Information
