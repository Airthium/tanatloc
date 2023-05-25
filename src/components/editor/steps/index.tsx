/** @module Components.Editor.Steps */

import { useContext, useState } from 'react'
import { Steps } from 'antd'
import JSON5 from 'json5'
import Ajv from 'ajv'

import { EditorContext } from '@/context/editor'
import {
  setModel,
  setModelValid,
  setTemplateValid
} from '@/context/editor/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { checkModel } from './utils'

import JSONModel from './model.json'

import style from '../index.module.css'
import { JSON5Error } from '../code/json'

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
        const ajv = new Ajv()
        const validate = ajv.compile(JSONModel)
        const valid = validate(JSON5.parse(model))
        if (valid) {
          setStatus((prev) => ({
            ...prev,
            model: { status: 'finish' }
          }))
          dispatch(setModelValid(true))
          // editorRef.current?.editor.getSession().setAnnotations([])
          // setIsError('')
        } else {
          const errorMessage = validate.errors
            ?.map((error) => {
              return error.message + ' in "' + error.instancePath + '"'
            })
            .join(' ')
          // editorRef.current?.editor.getSession().setAnnotations([
          //   {
          //     row: 0,
          //     column: 1,
          //     text: validate.errors?.[0].message ?? '',
          //     type: 'error'
          //   }
          // ]) // TODO
          setStatus((prev) => ({
            ...prev,
            model: { status: 'error', err: errorMessage }
          }))
          dispatch(setModelValid(false))
        }
      } catch (err: any) {
        const json5Error = err as JSON5Error
        // const lineNumber = json5Error.lineNumber - 1
        // const columnNumber = json5Error.columnNumber
        // const annotations = [
        //   {
        //     row: lineNumber,
        //     column: columnNumber,
        //     text: json5Error.message,
        //     type: 'error'
        //   }
        // ]
        // editorRef.current?.editor.getSession().setAnnotations(annotations)
        // TODO
        setStatus((prev) => ({
          ...prev,
          model: { status: 'error', err: json5Error.message }
        }))
        dispatch(setModelValid(false))
      }

      // try {
      //   let modelJSON
      //   try {
      //     modelJSON = JSON.parse(model)
      //   } catch (err) {
      //     modelJSON = JSON5.parse(model)
      //     dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
      //   }

      //   if (modelJSON.name) setName(modelJSON.name)

      //   checkModel(modelJSON)

      //   setStatus((prev) => ({
      //     ...prev,
      //     model: { status: 'finish' }
      //   }))
      //   dispatch(setModelValid(true))
      // } catch (err: any) {
      //   setStatus((prev) => ({
      //     ...prev,
      //     model: { status: 'error', err: err.message }
      //   }))
      //   dispatch(setModelValid(false))
      // }
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

// {' '}
//         {isError ? (
//           <Tooltip title={isError}>
//             <WarningOutlined
//               style={{
//                 fontSize: '30px',
//                 zIndex: '1000',
//                 color: 'orange'
//               }}
//             />
//           </Tooltip>
//         ) : (
//           ''
//         )}
