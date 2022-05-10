import { useState } from 'react'
import { Button, Form, Input, Layout, Select } from 'antd'

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

  // Parameters
  let parameters = null
  if (filter) {
    const post = PostprocessingList.find((pp) => pp.key === filter)
    const defaultPost = postprocessing.find((pp) => pp.key === filter)

    if (post && post.parameters) {
      parameters = post.parameters.map((parameter, index) => {
        const defaultParameter = defaultPost?.parameters.find(
          (param) => param.key === parameter.key
        )
        if (defaultParameter) {
          return (
            <Form.Item
              key={parameter.key}
              label={parameter.label}
              name={['parameters', index]}
              initialValue={defaultParameter.value}
            >
              <Input disabled={true} />
            </Form.Item>
          )
        } else {
          return (
            <Form.Item
              key={parameter.key}
              label={parameter.label}
              name={['parameters', index]}
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
      style={{ position: 'absolute', zIndex: 150, right: 0, bottom: 150 }}
    >
      <Layout.Content>
        <Form>
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
      </Layout.Content>
    </Layout>
  )
}

export default Postprocessing
