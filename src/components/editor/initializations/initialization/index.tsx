import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Space
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { AddButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

export interface IProps {
  initialization?: IConfiguration['initializations']['key'] & { key: string }
  onAdd?: (values: IConfiguration['initializations']['key']) => void
  onEdit?: (values: IConfiguration['initializations']['key']) => void
}

const existingAlgorithms = ['algo1', 'algo2']
// TODO real algorihtms list

/**
 * Initialization
 * @param props Props
 */
const Initialization = ({
  initialization,
  onAdd,
  onEdit
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [type, setType]: [string, Dispatch<SetStateAction<string>>] = useState()

  useEffect(() => {
    setVisible(!!initialization)
    if (initialization) setType(initialization.type)
  }, [initialization])

  const onType = (event: RadioChangeEvent): void => {
    const value = event.target.value
    setType(value)
  }

  /**
   * Validator
   * @param _ Unused
   * @param value Value
   * @returns Promise
   */
  const validator = (
    _: any,
    value:
      | IConfiguration['initializations']['key']['children']
      | IConfiguration['initializations']['key']['compatibility']
  ) => {
    if (!value?.length) return Promise.reject(new Error('Options are required'))
    return Promise.resolve()
  }

  /**
   * Direct form
   */
  const directForm = () => (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.List name="children" rules={[{ validator }]}>
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
                  name={[name, 'name']}
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
              <Button
                className={!fields.length && 'required'}
                onClick={() => add()}
              >
                Add input
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  )

  /**
   * Coupling form
   */
  const couplingForm = () => (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.List name="compatibility" rules={[{ validator }]}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Space>
                  Compatibility {name + 1}
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </Space>

                <Form.Item
                  {...restField}
                  label="Algorithm"
                  name={[name, 'algorithm']}
                  rules={[{ required: true, message: 'Algorithm is required' }]}
                >
                  <Select>
                    {existingAlgorithms.map((a) => (
                      <Select.Option key={a} value={a}>
                        {a}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter name"
                  name={[name, 'filter', 'name']}
                  rules={[
                    { required: true, message: 'Filter name is required' }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter prefix pattern"
                  name={[name, 'filter', 'prefixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter suffix pattern"
                  name={[name, 'filter', 'suffixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter pattern"
                  name={[name, 'filter', 'pattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter multiplicator"
                  name={[name, 'filter', 'multiplicator']}
                >
                  <Input value="TODO" />
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button
                className={!fields.length && 'required'}
                onClick={() => add()}
              >
                Add compatibility
                <Form.ErrorList errors={errors} />
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  )

  /**
   * On finish
   * @param values Values
   */
  const onFinish = (values: IConfiguration['initializations']['key']) => {
    if (initialization) onEdit(values)
    else onAdd(values)

    setVisible(false)
  }

  /**
   * On Cancel
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
        initialValues={initialization}
        onFinish={onFinish}
      >
        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Radio.Group onChange={onType}>
            <Radio value="direct">Direct</Radio>
            <Radio value="coupling">Coupling</Radio>
          </Radio.Group>
        </Form.Item>
        {type === 'direct' && directForm()}
        {type === 'coupling' && couplingForm()}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialization ? 'Edit' : 'Add'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    )
  else
    return (
      <AddButton onAdd={() => setVisible(true)}>Add initialization</AddButton>
    )
}

export default Initialization
