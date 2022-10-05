/** @module Components.Editor.Steps */

import { useContext, useEffect, useState } from 'react'
import { Steps } from 'antd'

import { EditorContext } from '@/context/editor'
import { setModelValid, setTemplateValid } from '@/context/editor/actions'

/**
 * Props
 */
export interface IProps {
  setName: (name: string) => void
}

/**
 * Status steps
 * @returns StatusSteps
 */
const StatusSteps = ({ setName }: IProps) => {
  //State
  const [status, setStatus] = useState<{
    [key: string]: 'wait' | 'process' | 'finish' | 'error'
  }>({})

  const { template, model, dispatch } = useContext(EditorContext)

  // Check template
  useEffect(() => {
    if (!template) {
      setStatus((prev) => ({
        ...prev,
        template: 'wait',
        test: 'wait'
      }))
      dispatch(setTemplateValid(false))
      return
    }

    try {
      // TODO
      setStatus((prev) => ({
        ...prev,
        template: 'finish',
        test: prev.model === 'finish' ? 'process' : 'wait'
      }))
      dispatch(setTemplateValid(true))
    } catch (err) {
      setStatus((prev) => ({ ...prev, template: 'error', test: 'wait' }))
    }
  }, [template, dispatch])

  // Check model
  useEffect(() => {
    if (!model) {
      setStatus((prev) => ({
        ...prev,
        model: 'wait',
        test: 'wait'
      }))
      dispatch(setModelValid(false))
      return
    }

    try {
      const modelJSON = JSON.parse(model)

      if (modelJSON.name) setName(modelJSON.name)

      if (!modelJSON.category) throw new Error('missing category')
      if (!modelJSON.name) throw new Error('missing name')
      if (!modelJSON.algorithm) throw new Error('missing algorithm')
      if (!modelJSON.code) throw new Error('missing code')
      if (!modelJSON.version) throw new Error('missing version')
      if (!modelJSON.configuration) throw new Error('missing configuration')
      if (!modelJSON.configuration.geometry)
        throw new Error('missing configuration.geometry')
      // TODO ...

      setStatus((prev) => ({
        ...prev,
        model: 'finish',
        test: prev.model === 'finish' ? 'process' : 'wait'
      }))
      dispatch(setModelValid(true))
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        model: 'error',
        test: 'wait'
      }))
      dispatch(setModelValid(false))
    }
  }, [model, setName, dispatch])

  return (
    <Steps className="Editor-Steps" direction="vertical" onChange={console.log}>
      <Steps.Step
        title="Check template format"
        description="EJS + FreeFEM"
        status={status.template ?? 'wait'}
        disabled={true}
      />
      <Steps.Step
        title="Check description format"
        description="JSON"
        status={status.model ?? 'wait'}
        disabled={true}
      />
      <Steps.Step
        title="Test template + description"
        description="Run template on Tanatloc server"
        status={status['test'] ?? 'wait'}
        disabled={!(status.template === 'finish' && status.model === 'finish')}
      />
    </Steps>
  )
}

export default StatusSteps
