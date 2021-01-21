import { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
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

const Rescale = ({ data, onSelect }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState()
  const [lowPriority, setLowPriority] = useState(true)
  const [coresError, setCoresError] = useState()
  const [numberOfCores, setNumberOfCores] = useState()
  const [version, setVersion] = useState()
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  // Data
  data.coreTypes.forEach((d) => {
    d.key = d.name
  })

  const options = data.freefem.versions.map((v) => ({
    label: v.version,
    value: v.id
  }))

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
    let currentPrice =
      numberOfCores *
      (lowPriority ? selected?.lowPriorityPrice : selected?.price)

    currentPrice *= 100
    currentPrice = Math.round(currentPrice)
    currentPrice /= 100

    setPrice(currentPrice.toFixed(2))
  }, [selected, numberOfCores, lowPriority])

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
    setLowPriority(true)
  }

  /**
   * On ok
   */
  const onOk = () => {
    if (step === 1) {
      setNumberOfCores(selected.fullCores[0])
      setStep(step + 1)
    } else {
      setLoading(true)
      onSelect({
        inUseConfiguration: {
          coreTypes: {
            value: selected.code
          },
          numberOfCores: {
            value: numberOfCores
          },
          lowPriority: {
            value: lowPriority
          },
          freefemVersion: {
            value: version?.label,
            id: version?.value
          }
        }
      })
      setLoading(false)
      close()
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    close()
  }

  /**
   * On cores change
   * @param {number} value Value
   */
  const onCoresChange = (value) => {
    if (!selected.fullCores.includes(value)) {
      setCoresError(true)
      setNumberOfCores(value)
    } else {
      setCoresError(false)
      setNumberOfCores(value)
    }
  }

  const onCoresStep = (value, info) => {
    if (info.type === 'up') {
      const sorted = selected.fullCores.filter((c) => c >= value)

      if (sorted.length) onCoresChange(sorted[0])
      else onCoresChange(selected.fullCores[selected.fullCores.length - 1])
    } else {
      // down
      const sorted = selected.fullCores.filter((c) => c <= value)

      if (sorted.length) onCoresChange(sorted.pop())
      else onCoresChange(selected.fullCores[0])
    }
  }

  const onVersionChange = (value, option) => {
    setVersion(option)
  }

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
        width="auto"
      >
        {step === 1 && (
          <Space direction="vertical">
            <Typography.Text strong={true}>Select a coretype:</Typography.Text>
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
          <>
            <Space direction="vertical">
              <Typography.Text strong={true}>Informations:</Typography.Text>
              <Typography.Text>
                {selected.name} Core (x{numberOfCores})
              </Typography.Text>
              <Typography.Text>Price: {price} / hour</Typography.Text>
            </Space>
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
              <Form.Item label="Priority">
                <Radio.Group
                  onChange={(e) => setLowPriority(e.target.value)}
                  value={lowPriority}
                >
                  <Radio value={false}>On-Demand Pro</Radio>
                  <Radio value={true}>On-Demand</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Number of cores">
                <InputNumber
                  min={selected.fullCores[0]}
                  max={selected.fullCores[selected.fullCores.length - 1]}
                  value={numberOfCores}
                  onChange={onCoresChange}
                  onStep={onCoresStep}
                  style={{ border: coresError && '1px solid red' }}
                />
              </Form.Item>
              <Form.Item label="FreeFEM version">
                <Select
                  options={options}
                  value={version?.value}
                  onChange={onVersionChange}
                ></Select>
              </Form.Item>
            </Form>
          </>
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
