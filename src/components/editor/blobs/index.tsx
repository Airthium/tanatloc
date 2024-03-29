/** @module Components.Editor.Blobs */

import { Dispatch } from 'react'
import { Collapse, Space } from 'antd'

import { IEditorAction, IEditorCursor } from '@/context/editor'
import { setTemplate } from '@/context/editor/actions'

import Mesh from './mesh'
import Materials from './materials'
import FiniteElementSpace from './finiteElementSpace'
import Header from './header'
import Dimension from './dimension'
import FiniteElementFunction from './finiteElementFunction'
import Macros from './macros'
import Solver from './solver'
import Save from './save'
import Data from './data'
import Sensors from './sensors'

import globalStyle from '@/styles/index.module.css'

/**
 * Add on cursor
 * @param template Template
 * @param text Text
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addOnCursor = (
  template: string,
  text: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!cursor) {
    dispatch(setTemplate(template + text))
  } else {
    const row = cursor.row
    const rows = template.split('\n')
    const newTemplate = [
      ...rows.slice(0, row + 1),
      ...text.split('\n'),
      ...rows.slice(row + 1)
    ]
    dispatch(setTemplate(newTemplate.join('\n')))
  }
}

/**
 * Blobs
 * @returns Blobs
 */
const Blobs: React.FunctionComponent = () => {
  /**
   * Render
   */
  return (
    <div id="blobs">
      <Collapse
        style={{ overflow: 'auto', maxHeight: 'calc(100% - 443px)' }}
        items={[
          {
            key: 'head',
            label: 'Head',
            children: (
              <Space direction="vertical" className={globalStyle.fullWidth}>
                <Header />
                <Dimension />
              </Space>
            )
          },
          {
            key: 'components',
            label: 'Components',
            children: (
              <Space direction="vertical" className={globalStyle.fullWidth}>
                <Mesh />
                <Materials />
                <FiniteElementSpace />
                <FiniteElementFunction />
                <Macros />
                <Solver />
              </Space>
            )
          },
          {
            key: 'results',
            label: 'Results',
            children: (
              <Space direction="vertical" className={globalStyle.fullWidth}>
                <Save />
                <Data />
                <Sensors />
              </Space>
            )
          }
        ]}
      />
    </div>
  )
}

export default Blobs
