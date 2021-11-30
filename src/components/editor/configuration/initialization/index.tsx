import PropTypes from 'prop-types'
import { useState } from 'react'
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

import { IConfiguration } from '../..'

import Dialog from '@/components/assets/dialog'

const existingAlgorithms = ['algo1', 'algo2']
// TODO real algorihtms list

interface IProps {
  visible?: boolean
  initialization: IConfiguration['initialization']['key']
  onOk: Function
  onClose: Function
}

const Initialization = ({
  visible,
  initialization,
  onOk,
  onClose
}: IProps): JSX.Element => {
  // State
  const [type, setType]: [string, Function] = useState(initialization?.key)

  /**
   * On type
   * @param event Event
   */
  const onType = (event: RadioChangeEvent): void => {
    const value = event.target.value
    setType(value)
  }

  /**
   * Direct form
   */
  const directForm = () => (
    <>
      <Form.Item name="label" label="Label" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.List name="inputs" initialValue={initialization?.children}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
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
            <Button onClick={() => add()}>Add compatibility</Button>
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
      <Form.Item name="label" label="Label" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.List
        name="compatibility"
        initialValue={initialization?.compatibility}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
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
                  fieldKey={[fieldKey, 'algorithm']}
                  rules={[{ required: true }]}
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
                  name={[name, 'filter.name']}
                  fieldKey={[fieldKey, 'filter.name']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter prefix pattern"
                  name={[name, 'filter.prefixPattern']}
                  fieldKey={[fieldKey, 'filter.prefixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter suffix pattern"
                  name={[name, 'filter.suffixPattern']}
                  fieldKey={[fieldKey, 'filter.suffixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter pattern"
                  name={[name, 'filter.pattern']}
                  fieldKey={[fieldKey, 'filter.pattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Filter multiplicator"
                  name={[name, 'filter.multiplicator']}
                  fieldKey={[fieldKey, 'filter.multiplicator']}
                >
                  TODO
                </Form.Item>
              </div>
            ))}
            <Button onClick={() => add()}>Add compatibility</Button>
          </>
        )}
      </Form.List>
    </>
  )

  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Initialization"
      initialValues={initialization}
      onCancel={onClose}
      onOk={(values: IConfiguration['initialization']['key']) =>
        onOk({ ...values, type })
      }
    >
      <Radio.Group onChange={onType}>
        <Radio value="direct">Direct</Radio>
        <Radio value="coupling">Coupling</Radio>
      </Radio.Group>
      {type === 'direct' && directForm()}
      {type === 'coupling' && couplingForm()}
    </Dialog>
  )
}

Initialization.propTypes = {
  visible: PropTypes.bool,
  initialization: PropTypes.exact({}),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Initialization
