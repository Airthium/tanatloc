import PropTypes from 'prop-types'
import { Button, Divider, Form, Input, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { IConfiguration } from '../..'

export interface IProps {
  visible?: boolean
  results: IConfiguration['results']
  onOk: Function
  onClose: Function
}

/**
 * Results
 * @param props Props
 */
const Results = ({ visible, results, onOk, onClose }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Results"
      initialValues={results}
      onCancel={onClose}
      onOk={(values: {
        fields: { name: string }[]
        filter: {
          name: string
          prefixPattern?: string
          suffixPattern?: string
          pattern?: string
          multiplicator?: string[]
        }[]
      }) => onOk(values)}
    >
      <Form.List name="fields" initialValue={results?.fields}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Space>
                  Result field {name + 1}
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
              </div>
            ))}
            <Button onClick={() => add()}>Add result field</Button>
          </>
        )}
      </Form.List>
      <Divider />
      <Form.List
        name="filter"
        initialValue={results?.filter && [results.filter]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Space>
                  Filter
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
                  label="Prefix pattern"
                  name={[name, 'prefixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Suffix pattern"
                  name={[name, 'suffixPattern']}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Pattern" name={[name, 'pattern']}>
                  <Input />
                </Form.Item>
                <Form.Item label="Multiplicator" name={[name, 'multiplicator']}>
                  TODO
                </Form.Item>
              </div>
            ))}
            <Button disabled={fields.length > 0} onClick={() => add()}>
              Add result field
            </Button>
          </>
        )}
      </Form.List>
    </Dialog>
  )
}

Results.propTypes = {
  visible: PropTypes.bool,
  results: PropTypes.exact({
    fields: PropTypes.array,
    filter: PropTypes.exact({
      name: PropTypes.string.isRequired,
      prefixPattern: PropTypes.string,
      suffixPattern: PropTypes.string,
      pattern: PropTypes.string,
      multiplicator: PropTypes.array
    })
  }),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Results
