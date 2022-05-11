import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Layout,
  Select,
  Space,
  Tooltip
} from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  RadarChartOutlined,
  RocketOutlined
} from '@ant-design/icons'

import PostprocessingList from '@/postprocessing'

import { ErrorNotification } from '@/components/assets/notification'
import Download from '@/components/project/simulation/run/results/download'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'
import PostprocessingAPI from '@/api/postprocessing'

export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  result?: Pick<IFrontResult, 'name' | 'fileName' | 'originPath'>
  postprocessing?: Pick<IFrontResult, 'name' | 'fileName'>
  setResult: (result?: IFrontResult) => void
}

export interface IPostProcessFile {
  fileName: string
  name: string
  originPath: string
  glb: string
  json: string
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
): Promise<IPostProcessFile[] | undefined> => {
  try {
    return await PostprocessingAPI.run(simulation, result, filter, parameters)
  } catch (err) {
    ErrorNotification('postprocessing', err)
  }
}

/**
 * Postprocessing
 * @param props Props
 * @returns Postprocessing
 */
const Postprocessing = ({
  simulation,
  result,
  postprocessing,
  setResult
}: IProps): JSX.Element | null => {
  // State
  const [visible, setVisible] = useState<boolean>()
  const [filter, setFilter] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [results, setResults] = useState<IPostProcessFile[]>()

  // Update visible
  useEffect(() => {
    if (!result && visible) setVisible(false)
  }, [result, visible])

  /**
   * Empty render
   */
  if (!simulation || !result) return null

  // Data
  const postprocess = simulation.scheme.configuration.run.postprocessing

  /**
   * Empty render
   */
  if (!postprocess) return null

  // Options
  const options = PostprocessingList.map((p) => {
    if (postprocess.find((pp) => pp.key === p.key))
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
    const defaultPost = postprocess.find((pp) => pp.key === filter)

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
            style={{ margin: '24px 0' }}
            onFinish={async (values) => {
              setLoading(true)
              try {
                const newResults = await run(
                  { id: simulation.id },
                  result,
                  filter!,
                  values.parameters || []
                )
                setResults(newResults)
              } catch (err) {}
              setLoading(false)
            }}
          >
            {parameters}
            <Form.Item>
              <Button
                type="primary"
                loading={loading}
                htmlType="submit"
                icon={<RocketOutlined />}
              >
                Run
              </Button>
            </Form.Item>
          </Form>
          {results && (
            <Card size="small" title="Post-processing" extra={filter}>
              <Space direction="vertical" className="full-width">
                {results.map((res) => (
                  <Space key={res.glb}>
                    <Button
                      icon={
                        postprocessing?.fileName === res.fileName &&
                        postprocessing?.name === res.name ? (
                          <EyeOutlined style={{ color: '#fad114' }} />
                        ) : (
                          <EyeInvisibleOutlined />
                        )
                      }
                      onClick={() =>
                        setResult(
                          postprocessing?.fileName === res.fileName &&
                            postprocessing?.name === res.name
                            ? undefined
                            : {
                                type: 'postprocessing',
                                ...res
                              }
                        )
                      }
                    />
                    <Download
                      simulation={{
                        id: simulation.id
                      }}
                      file={{
                        name: res.name,
                        fileName: res.fileName,
                        originPath: res.originPath
                      }}
                    />
                    {res.name}
                  </Space>
                ))}
              </Space>
            </Card>
          )}
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Postprocessing
