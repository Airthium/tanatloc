/** @module Components.Editor.Steps */

import { useContext, useState } from 'react'
import { Steps } from 'antd'
import JSON5 from 'json5'
import Ajv from 'ajv'

import { EditorContext } from '@/context/editor'
import {
  setJsonError,
  setModelValid,
  setTemplateValid
} from '@/context/editor/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import JSONModel from './model.json'

import style from '../index.module.css'
import { JSON5Error } from '../code/json'

/**
 * Props
 */
export interface IProps {
  setName: (name: string) => void
}

export interface IStatus {
  status: 'wait' | 'process' | 'finish' | 'error'
  err?: string
}

/**
 * Status steps
 * @returns StatusSteps
 */
const StatusSteps: React.FunctionComponent<IProps> = ({ setName }) => {
  //State
  const [status, setStatus] = useState<{
    [key: string]: IStatus
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
          }
        }))
        dispatch(setTemplateValid(false))
        return
      }

      // Check template
      setStatus((prev) => ({
        ...prev,
        template: { status: 'finish' }
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
          model: { status: 'wait' }
        }))
        dispatch(setModelValid(false))
        return
      }

      try {
        const ajv = new Ajv({ allowUnionTypes: true })
        const validate = ajv.compile(JSONModel)
        const valid = validate(JSON5.parse(model))
        if (valid) {
          setStatus((prev) => ({
            ...prev,
            model: { status: 'finish' }
          }))
          dispatch(setModelValid(true))
          dispatch(setJsonError())
          setName(JSON5.parse(model).name)
        } else {
          const errorMessage = validate.errors
            ?.map((error) => {
              return (
                error.message + ' in "' + (error.instancePath || 'root') + '"'
              )
            })
            .join(' ')
          setStatus((prev) => ({
            ...prev,
            model: { status: 'error', err: errorMessage }
          }))
          dispatch(setModelValid(false))
        }
      } catch (err: any) {
        const json5Error = err as JSON5Error
        const lineNumber = json5Error.lineNumber - 1
        const columnNumber = json5Error.columnNumber
        dispatch(
          setJsonError({
            title: 'Syntax error',
            description: json5Error.message,
            type: 'error',
            row: lineNumber,
            column: columnNumber
          })
        )
        setStatus((prev) => ({
          ...prev,
          model: { status: 'error', err: json5Error.message }
        }))
        dispatch(setModelValid(false))
      }
    },
    [model],
    [setName, dispatch]
  )

  const formatDescription = (
    statusObj: IStatus,
    defaultDescription: string
  ) => {
    if (!statusObj?.err) return defaultDescription

    const formattedError = statusObj.err
      .replace(/\./g, ' > ')
      .replace(/must/g, '\n  - Must')
      .split('\n')

    return <span>{formattedError}</span>
  }

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
            status: status.template?.status ?? 'wait',
            description: formatDescription(status.template, 'EJS + FreeFEM')
          },
          {
            title: 'Check description format',
            status: status.model?.status ?? 'wait',
            description: formatDescription(
              status.model,
              'Check description format'
            )
          }
        ]}
      />
    </div>
  )
}

export default StatusSteps
