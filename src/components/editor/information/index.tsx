import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card, Divider, Form, Input, Layout, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { IConfiguration } from '../'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ information: { name, category, description } }) => void
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
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Form
            layout="vertical"
            initialValues={configuration.information}
            onFinish={(values) => onNext({ information: values })}
          >
            <Form.Item
              name="name"
              label="Name"
              tooltip="The name will be displayed in the algorithm list"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              tooltip="The category is used for category filtering in the algorithm list"
              rules={[{ required: true, message: 'Category is required' }]}
            >
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
                        <PlusOutlined /> Add category
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
              tooltip="The description will be displayed at algorithm selection"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Information.propTypes = {
  configuration: PropTypes.shape({
    information: PropTypes.exact({
      name: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string
    })
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default Information
