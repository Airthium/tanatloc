/** @module Components.Editor.Steps */

import { useContext, useState } from 'react'
import { Steps } from 'antd'
import JSON5 from 'json5'

import { EditorContext } from '@/context/editor'
import {
  setModel,
  setModelValid,
  setTemplateValid
} from '@/context/editor/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { checkModel } from './utils'

import style from '../index.module.css'

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

  // Context
  const { template, model, dispatch } = useContext(EditorContext)

  // Check template
  useCustomEffect(
    () => {
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
    },
    [template],
    [dispatch]
  )

  // Check model
  useCustomEffect(
    () => {
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
        let modelJSON
        try {
          modelJSON = JSON.parse(model)
        } catch (err) {
          modelJSON = JSON5.parse(model)
          dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
        }

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
    },
    [model],
    [setName, dispatch]
  )

  /**
   * Render
   */
  return (
    <div id="steps">
      <Steps
        className={style.steps}
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
          }
        ]}
      />
    </div>
  )
}

export default StatusSteps
