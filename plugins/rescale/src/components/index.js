import { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Typography
} from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

const errors = {
  validateError: 'Missing values'
}

const Rescale = ({ data, onSelect }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState()
  const [numberOfCores, setNumberOfCores] = useState()
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  // Data
  const [form] = Form.useForm()

  // Set keys
  data.coreTypes.forEach((d) => {
    d.key = d.name
  })

  // Get version options
  const options = data.freefem.versions.map((v) => ({
    label: v.version,
    value: v.id
  }))

  // Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Space direction="vertical">
            <Space>
              <Avatar
                style={{
                  marginRight: '-20px',
                  background:
                    'linear-gradient(to right,' +
                    record.color +
                    ', rgba(255, 255, 255, 0))',
                  opacity: 0.5
                }}
              />
              <Typography.Text strong={true}>{text}</Typography.Text>
            </Space>
            {record.processorInfo}
          </Space>
        </Space>
      )
    },
    {
      title: 'Cores',
      dataIndex: 'cores',
      key: 'cores',
      render: (cores) => cores.join(', ')
    },
    {
      title: 'Memory',
      dataIndex: 'memory',
      key: 'memory',
      render: (text) => text / 1000 + ' Go'
    },
    {
      title: 'Pro Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Price',
      dataIndex: 'lowPriorityPrice',
      key: 'lowPriorityPrice'
    }
  ]

  // Extend cores
  useEffect(() => {
    if (selected?.cores) {
      const max = selected.cores[selected.cores.length - 1]
      const more = Math.floor(1000 / max)

      const cores = [...selected.cores]
      for (let i = 0; i < more - 1; ++i) {
        cores.push(max * (i + 2))
      }

      selected.fullCores = cores
    }
  }, [selected])

  // Set price
  useEffect(() => {
    if (step > 1) computePrice()
  }, [step])

  /**
   * On row change
   * @param {string} selectedRowKeys key
   * @param {Object} selectedRows Seleced
   */
  const onRowChange = (selectedRowKeys, selectedRows) => {
    setSelected(selectedRows[0])
  }

  /**
   * Get checkbox props
   * @param {Object} record Record
   */
  const getCheckboxProps = (record) => ({
    disabled: record.mustBeRequested
  })

  /**
   * Close
   */
  const close = () => {
    setVisible(false)
    setStep(1)
    setSelected()
    setNumberOfCores()
    setPrice(0)
    setLoading(false)
  }

  /**
   * On ok
   */
  const onOk = async () => {
    if (step === 1) {
      setNumberOfCores(selected.fullCores[0])
      setStep(step + 1)
    } else {
      setLoading(true)

      try {
        const values = await form.validateFields()

        const freefem = options.find((o) => o.value === values.version)

        onSelect({
          inUseConfiguration: {
            coreTypes: {
              value: selected.code
            },
            numberOfCores: {
              value: values.numberOfCores
            },
            lowPriority: {
              value: values.lowPriority
            },
            freefemVersion: {
              value: freefem.label,
              id: freefem.value
            }
          }
        })

        close()
      } catch (err) {
        Error(errors.validateError, err)
      } finally {
        setLoading(false)
      }
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    close()
  }

  /**
   * On cores step
   * @param {number} value Value
   * @param {string} type Type
   */
  const onCoresStep = (value, type) => {
    if (type === 'up') {
      const sorted = selected.fullCores.filter((c) => c >= value)

      return sorted.length
        ? sorted[0]
        : selected.fullCores[selected.fullCores.length - 1]
    } else {
      // down
      const sorted = selected.fullCores.filter((c) => c <= value)

      return sorted.length ? sorted.pop() : selected.fullCores[0]
    }
  }

  /**
   *
   * @param {Object} changedValues Changed values
   * @param {Object} allValues All values
   */
  const onValuesChange = (changedValues, allValues) => {
    const newNumberOfCores = changedValues.numberOfCores
    if (newNumberOfCores !== undefined) {
      // Check number of cores
      let correctedNumberOfCores
      if (newNumberOfCores > numberOfCores)
        correctedNumberOfCores = onCoresStep(newNumberOfCores, 'up')
      else correctedNumberOfCores = onCoresStep(newNumberOfCores, 'down')

      // Force from
      allValues.numberOfCores = correctedNumberOfCores
      form.setFieldsValue(allValues)

      setNumberOfCores(correctedNumberOfCores)
    }

    // Compute price
    computePrice()
  }

  /**
   * Compute price
   */
  const computePrice = () => {
    const values = form.getFieldsValue(['lowPriority', 'numberOfCores'])

    let currentPrice =
      values.numberOfCores *
      (values.lowPriority ? selected?.lowPriorityPrice : selected?.price)

    currentPrice *= 100
    currentPrice = Math.round(currentPrice)
    currentPrice /= 100

    setPrice(currentPrice.toFixed(2))
  }

  /**
   * Render
   */
  return (
    <>
      <Modal
        title="Rescale plugin"
        visible={visible}
        onCancel={onCancel}
        okText={step === 1 ? 'Next' : 'Ok'}
        okButtonProps={{
          disabled: step === 1 && !selected,
          loading: loading
        }}
        onOk={onOk}
        maskClosable={false}
      >
        {step === 1 && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Title level={5}>Select a coretype</Typography.Title>
            <Table
              dataSource={data.coreTypes}
              columns={columns}
              rowSelection={{
                type: 'radio',
                onChange: onRowChange,
                getCheckboxProps: getCheckboxProps
              }}
            />
          </Space>
        )}
        {step === 2 && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="Informations">
              <Space direction="vertical">
                <Typography.Text>
                  {selected.name} Core (x{form.getFieldValue('numberOfCores')})
                </Typography.Text>
                <Typography.Text>Price: {price} / hour</Typography.Text>
              </Space>
            </Card>
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              initialValues={{
                lowPriority: true,
                numberOfCores: selected.fullCores[0],
                version: options[0].value
              }}
              onValuesChange={onValuesChange}
            >
              <Form.Item
                name="lowPriority"
                label="Priority"
                htmlFor="lowPriority"
                rules={[{ required: true, message: '"Priority" is required' }]}
              >
                <Radio.Group id="lowPriority">
                  <Radio value={false}>On-Demand Pro</Radio>
                  <Radio value={true}>On-Demand</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="numberOfCores"
                label="Number of cores"
                htmlFor="numberOfCores"
                rules={[
                  { required: true, message: '"Number of cores" is required' }
                ]}
              >
                <InputNumber
                  id="numberOfCores"
                  min={selected.fullCores[0]}
                  max={selected.fullCores[selected.fullCores.length - 1]}
                  parser={() => {
                    return numberOfCores
                  }}
                />
              </Form.Item>
              <Form.Item
                name="version"
                label="FreeFEM version"
                htmlFor="version"
                rules={[
                  { required: true, message: '"FreeFEM version" is required' }
                ]}
              >
                <Select id="version" options={options}></Select>
              </Form.Item>
            </Form>
          </Space>
        )}
      </Modal>
      <Space>
        <Typography.Text>
          More information on{' '}
          <a href="https://www.rescale.com/infrastructure/" target="_blank">
            Rescale website
          </a>
          .
        </Typography.Text>
        <Button onClick={() => setVisible(true)} icon={<SelectOutlined />} />
      </Space>
    </>
  )
}

export default Rescale
