/** @module Components.Editor.Steps */

import { useContext, useEffect, useState } from 'react'
import { Button, Steps } from 'antd'

import { EditorContext } from '@/context/editor'
import { setModelValid, setTemplateValid } from '@/context/editor/actions'

import { checkModel } from './utils'

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
    [key: string]: {
      status: 'wait' | 'process' | 'finish' | 'error'
      err?: string
    }
  }>({})

  const { template, model, dispatch } = useContext(EditorContext)

  // Check template
  useEffect(() => {
    if (!template) {
      setStatus((prev) => ({
        ...prev,
        template: {
          status: 'wait',
          err: ''
        },
        test: {
          status: 'wait'
        }
      }))
      dispatch(setTemplateValid(false))
      return
    }

    // Check template
    setStatus((prev) => ({
      ...prev,
      template: { status: 'finish' },
      test: { status: prev.model?.status === 'finish' ? 'process' : 'wait' }
    }))
    dispatch(setTemplateValid(true))
  }, [template, dispatch])

  // Check model
  useEffect(() => {
    if (!model) {
      setStatus((prev) => ({
        ...prev,
        model: { status: 'wait' },
        test: { status: 'wait' }
      }))
      dispatch(setModelValid(false))
      return
    }

    try {
      const modelJSON = JSON.parse(model)

      if (modelJSON.name) setName(modelJSON.name)

      checkModel(modelJSON)

      setStatus((prev) => ({
        ...prev,
        model: { status: 'finish' },
        test: {
          status: prev.template?.status === 'finish' ? 'process' : 'wait'
        }
      }))
      dispatch(setModelValid(true))
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        model: { status: 'error', err: err.message },
        test: { status: 'wait' }
      }))
      dispatch(setModelValid(false))
    }
  }, [model, setName, dispatch])

  return (
    <Steps
      className="Editor-Steps"
      direction="vertical"
      items={[
        {
          title: 'Check template format',
          description: status.template?.err ?? 'EJS + FreeFEM',
          status: status.template?.status ?? 'wait'
        },
        {
          title: 'Check description format',
          description: status.model?.err?.replace(/\./g, ' > ') ?? 'JSON',
          status: status.model?.status ?? 'wait'
        },
        {
          title: 'Test template + description',
          description: (
            <>
              <Button
                disabled={
                  !(
                    status.template?.status === 'finish' &&
                    status.model?.status === 'finish'
                  )
                }
                onClick={console.log}
              >
                Run
              </Button>{' '}
              template on Tanatloc server
            </>
          ),
          status: status.test?.status ?? 'wait'
        }
      ]}
    />
  )
}

export default StatusSteps
