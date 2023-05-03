/** @module Components.Project.Simulation.Postprocesssing */

import { useCallback, useEffect, useMemo, useState } from 'react'
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

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'

import PostprocessingList from '@/postprocessing'

import { ErrorNotification } from '@/components/assets/notification'
import Download from '@/components/project/simulation/run/results/download'

import PostprocessingAPI from '@/api/postprocessing'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  results: Pick<IFrontResult, 'name' | 'fileName' | 'originPath'>[]
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

export interface IResultProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  postprocessing?: Pick<IFrontResult, 'name' | 'fileName'>
  result: IPostProcessFile
  setResult: (result?: IFrontResult) => void
}

export interface IResultsProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  postprocessing?: Pick<IFrontResult, 'name' | 'fileName'>
  results: IPostProcessFile[]
  setResult: (result?: IFrontResult) => void
}

/**
 * Errrors
 */
export const errors = {
  run: 'Unable to run filter'
}

/**
 * Run
 * @param simulation Simulation
 * @param result Result
 * @param filter Filter number
 * @param parameters Parameters
 */
const _run = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  result: Pick<IFrontResult, 'fileName' | 'originPath'>,
  filter: string,
  parameters: string[]
): Promise<IPostProcessFile[]> => {
  try {
    return await PostprocessingAPI.run(simulation, result, filter, parameters)
  } catch (err) {
    ErrorNotification(errors.run, err)
    throw err
  }
}

/**
 * Result
 * @param props Props
 * @returns Result
 */
const Result = ({
  simulation,
  postprocessing,
  result,
  setResult
}: IResultProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(
    () =>
      setResult(
        postprocessing?.fileName === result.fileName &&
          postprocessing?.name === result.name
          ? undefined
          : {
              type: 'postprocessing',
              ...result
            }
      ),
    [postprocessing, result, setResult]
  )

  /**
   * Render
   */
  return (
    <Space key={result.glb}>
      <Button
        icon={
          postprocessing?.fileName === result.fileName &&
          postprocessing?.name === result.name ? (
            <EyeOutlined className={globalStyle.primaryColor} />
          ) : (
            <EyeInvisibleOutlined />
          )
        }
        onClick={onClick}
      />
      <Download
        simulation={{
          id: simulation.id
        }}
        file={{
          name: result.name,
          fileName: result.fileName,
          originPath: result.originPath
        }}
      />
      {result.name}
    </Space>
  )
}

/**
 * Results
 * @param props Props
 * @returns Results
 */
const Results = ({
  simulation,
  postprocessing,
  results,
  setResult
}: IResultsProps): JSX.Element => {
  /**
   * Render
   */
  if (!results.length) return <>No results</>
  return (
    <Space direction="vertical" className={globalStyle.fullWidth}>
      {results.map((res) => (
        <Result
          key={res.glb}
          simulation={simulation}
          postprocessing={postprocessing}
          result={res}
          setResult={setResult}
        />
      ))}
    </Space>
  )
}

/**
 * Postprocessing
 * @param props Props
 * @returns Postprocessing
 */
const Postprocessing = ({
  simulation,
  results,
  postprocessing,
  setResult
}: IProps): JSX.Element | null => {
  // State
  const [visible, setVisible] = useState<boolean>()
  const [filter, setFilter] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [current, setCurrent] = useState<{
    filter: string
    results: IPostProcessFile[]
  }>()

  // Update visible
  useEffect(() => {
    if (results.length !== 1 && visible) setVisible(false)
  }, [results, visible])

  const result = useMemo(() => results[0], [results])

  // Cleanup
  useEffect(() => {
    if (!simulation) {
      setFilter(undefined)
      setCurrent(undefined)
    }
  }, [simulation])

  // Data
  const postprocess = useMemo(
    () => simulation?.scheme.configuration.run.postprocessing,
    [simulation]
  )

  // Options
  const options = useMemo(
    () =>
      PostprocessingList.map((p) => {
        if (postprocess?.find((pp) => pp.key === p.key))
          return {
            label: p.label,
            value: p.key
          }
      }).filter((p) => p) as { label: string; value: string }[],
    [postprocess]
  )

  // Parameters
  const parameters = useMemo(() => {
    if (!postprocess || !filter) return

    const post = PostprocessingList.find((pp) => pp.key === filter)
    const defaultPost = postprocess.find((pp) => pp.key === filter)

    if (!post?.parameters) return

    return post.parameters.map((parameter, index) => {
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
  }, [postprocess, filter])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    async (values: { parameters: string[] }): Promise<void> => {
      setLoading(true)
      try {
        const newResults = await _run(
          { id: simulation!.id },
          result,
          filter!,
          values.parameters ?? []
        )
        setCurrent({ filter: filter!, results: newResults })
      } catch (err) {}
      setLoading(false)
    },
    [simulation, result, filter]
  )

  /**
   * Render
   */
  if (!simulation || results.length !== 1) return null
  if (!postprocess) return null
  if (!options.length) return null
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
            onClick={setVisibleTrue}
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
          onClose={setVisibleFalse}
          open={visible}
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
            onFinish={onFinish}
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
          {current && (
            <Card size="small" title="Post-processing" extra={current.filter}>
              <Results
                simulation={simulation}
                postprocessing={postprocessing}
                results={current.results}
                setResult={setResult}
              />
            </Card>
          )}
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Postprocessing
