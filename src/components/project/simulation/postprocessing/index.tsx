import { useState } from 'react'
import { Button, Drawer, Form, Input, Layout, Select, Tooltip } from 'antd'
import { RadarChartOutlined } from '@ant-design/icons'

import PostprocessingList from 'postprocessing'

import { ErrorNotification } from '@/components/assets/notification'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'
import PostprocessingAPI from '@/api/postprocessing'

export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  result?: Pick<IFrontResult, 'fileName' | 'originPath'>
}

/**
 * Run
 * @param simulation Simulation
 * @param result Result
 * @param filter Filter number
 * @param parameters Parameters
 */
const run = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  result: Pick<IFrontResult, 'fileName' | 'originPath'>,
  filter: string,
  parameters: string[]
): Promise<void> => {
  try {
    await PostprocessingAPI.run(simulation, result, filter, parameters)
  } catch (err) {
    ErrorNotification('postprocessing', err)
  }
}

/**
 * Postprocessing
 * @param props Props
 * @returns Postprocessing
 */
const Postprocessing = ({ simulation, result }: IProps): JSX.Element | null => {
  // State
  const [visible, setVisible] = useState<boolean>()
  const [filter, setFilter] = useState<string>()
  const [loading, setLoading] = useState<boolean>()

  /**
   * Empty render
   */
  if (!simulation || !result) return null

  // Data
  const postprocessing = simulation.scheme.configuration.run.postprocessing

  /**
   * Empty render
   */
  if (!postprocessing) return null

  // Options
  const options = PostprocessingList.map((p) => {
    if (postprocessing.find((pp) => pp.key === p.key))
      return {
        label: p.label,
        value: p.key
      }
  }).filter((p) => p) as { label: string; value: string }[]

  /**
   * Empty render
   */
  if (!options.length) return null

  // Parameters
  let parameters = null
  if (filter) {
    const post = PostprocessingList.find((pp) => pp.key === filter)
    const defaultPost = postprocessing.find((pp) => pp.key === filter)

    if (post && post.parameters) {
      parameters = post.parameters.map((parameter, index) => {
        const defaultParameter = defaultPost?.parameters?.find(
          (param) => param.key === parameter.key
        )
        if (defaultParameter?.value) {
          return (
            <Form.Item
              key={parameter.key}
              label={parameter.label}
              name={['parameters', index]}
              initialValue={defaultParameter.value}
              rules={parameter.rules}
            >
              <Input disabled={true} />
            </Form.Item>
          )
        } else if (defaultParameter?.options) {
          return (
            <Form.Item
              key={parameter.key}
              label={parameter.label}
              name={['parameters', index]}
              rules={parameter.rules}
            >
              <Select
                options={defaultParameter.options.map((option) => ({
                  label: option,
                  value: option
                }))}
              />
            </Form.Item>
          )
        } else {
          return (
            <Form.Item
              key={parameter.key}
              label={parameter.label}
              name={['parameters', index]}
              rules={parameter.rules}
              initialValue={parameter.default}
            >
              <Input />
            </Form.Item>
          )
        }
      })
    }
  }

  /**
   * Render
   */
  return (
    <Layout
      style={{
        position: 'absolute',
        zIndex: 101,
        right: 25,
        bottom: 50,
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }}
    >
      <Layout.Content>
        <Tooltip title="Post-processing">
          <Button
            type="primary"
            icon={<RadarChartOutlined />}
            onClick={() => setVisible(true)}
            style={{
              width: 40,
              height: 40,
              border: '1px solid #5E14FA',
              borderRadius: 20,
              marginBottom: -20
            }}
          />
        </Tooltip>

        <Drawer
          title="Post-processing"
          closable={true}
          onClose={() => setVisible(false)}
          visible={visible}
          mask={false}
          maskClosable={false}
        >
          <Form style={{ margin: '24px 0' }}>
            <Form.Item name="filter" label="Filter">
              <Select
                placeholder="Select a filter"
                options={options}
                onChange={setFilter}
              />
            </Form.Item>
          </Form>
          <Form
            layout="vertical"
            onFinish={async (values) => {
              setLoading(true)
              try {
                await run(
                  { id: simulation.id },
                  result,
                  filter!,
                  values.parameters || []
                )
              } catch (err) {}
              setLoading(false)
            }}
          >
            {parameters}
            <Form.Item>
              <Button type="primary" loading={loading} htmlType="submit">
                Run
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Postprocessing
