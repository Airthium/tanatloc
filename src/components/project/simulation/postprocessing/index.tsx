/** @module Components.Project.Simulation.Postprocesssing */

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Card, Drawer, Form, Input, Select, Space } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  RocketOutlined
} from '@ant-design/icons'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'

import PostprocessingList from '@/postprocessing'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'
import { SelectContext } from '@/context/select'
import { setPostProcessing } from '@/context/select/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import Download from '@/components/project/simulation/run/results/download'

import PostprocessingAPI from '@/api/postprocessing'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Result = Pick<IFrontResult, 'name' | 'fileName' | 'originPath'>
export type PostProcessing = Pick<IFrontResult, 'name' | 'fileName'>
export interface IProps {
  simulation?: Simulation
  results: Result[]
  postprocessing?: PostProcessing
  setResult: (result?: IFrontResult) => void
}

export interface PostProcessingFile {
  fileName: string
  name: string
  originPath: string
  glb: string
  json: string
}

export interface IResultProps {
  simulation: Simulation
  postprocessing?: PostProcessing
  result: PostProcessingFile
  setResult: (result?: IFrontResult) => void
}

export interface IResultsProps {
  simulation: Simulation
  postprocessing?: PostProcessing
  results: PostProcessingFile[]
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
  simulation: Simulation,
  result: Result,
  filter: string,
  parameters: string[]
): Promise<PostProcessingFile[]> => {
  return await PostprocessingAPI.run(simulation, result, filter, parameters)
}

/**
 * Result
 * @param props Props
 * @returns Result
 */
const Result: React.FunctionComponent<IResultProps> = ({
  simulation,
  postprocessing,
  result,
  setResult
}) => {
  /**
   * On click
   */
  const onClick = useCallback(
    (): void =>
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
const Results: React.FunctionComponent<IResultsProps> = ({
  simulation,
  postprocessing,
  results,
  setResult
}) => {
  // Results length
  const resultsLength = useMemo(() => results.length, [results])

  /**
   * Render
   */
  if (!resultsLength) return <>No results</>
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
const Postprocessing: React.FunctionComponent<IProps> = ({
  simulation,
  results,
  postprocessing,
  setResult
}) => {
  // State
  const [filter, setFilter] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [current, setCurrent] = useState<{
    filter: string
    results: PostProcessingFile[]
  }>()

  // Context
  const { postProcessing, dispatch: selectDispatch } = useContext(SelectContext)
  const { dispatch } = useContext(NotificationContext)

  // Data
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
   * Set visible false
   */
  const setVisibleFalse = useCallback(
    (): void => selectDispatch(setPostProcessing(false)),
    [selectDispatch]
  )

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    (values: { parameters: string[] }): void => {
      asyncFunctionExec(async () => {
        setLoading(true)
        try {
          const newResults = await _run(
            simulation!,
            result,
            filter!,
            values.parameters ?? []
          )
          setCurrent({ filter: filter!, results: newResults })
        } catch (err: any) {
          dispatch(addError({ title: errors.run, err }))
        }
        setLoading(false)
      })
    },
    [simulation, result, filter, dispatch]
  )

  // Update visible
  useEffect(() => {
    if (results.length !== 1 && postProcessing) setVisibleFalse()
  }, [results, postProcessing, setVisibleFalse])

  /**
   * Render
   */
  if (!simulation || results.length !== 1) return null
  if (!postprocess) return null
  if (!options.length) return null
  return (
    <Drawer
      title="Post-processing"
      closable={true}
      onClose={setVisibleFalse}
      open={postProcessing}
      mask={false}
      maskClosable={false}
    >
      <Form>
        <Form.Item name="filter" label="Filter">
          <Select
            placeholder="Select a filter"
            options={options}
            onChange={setFilter}
          />
        </Form.Item>
      </Form>
      <Form layout="vertical" style={{ margin: '24px 0' }} onFinish={onFinish}>
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
  )
}

export default Postprocessing
