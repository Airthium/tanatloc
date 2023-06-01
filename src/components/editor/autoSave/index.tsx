/** @module Components.Editor.AutoSave */

import { Button, Switch, Tooltip } from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { EditorContext } from '@/context/editor'
import { setModel, setTemplate } from '@/context/editor/actions'

import style from '../index.module.css'

/**
 * AutoSave
 * @returns AutoSave
 */
const AutoSave = (): React.JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(true)
  const [checked, setChecked] = useState<boolean>(true)

  // Cookies
  const [cookies, setCookie] = useCookies(['accepted'])

  // Data
  const { model, template, dispatch } = useContext(EditorContext)

  // Auto-save
  useEffect(() => {
    if (cookies.accepted === 'true') {
      setDisabled(false)

      if (checked) {
        const id = setInterval(() => {
          sessionStorage.setItem('model', model)
          sessionStorage.setItem('template', template)
        }, 30_000)
        return () => clearInterval(id)
      }
    } else setDisabled(true)
  }, [cookies.accepted, checked, model, template, setCookie])

  /**
   * On checked
   * @param checked Checked
   */
  const onChecked = useCallback((checked: boolean): void => {
    setChecked(checked)
  }, [])

  /**
   * On reload
   */
  const onReload = useCallback((): void => {
    const model = sessionStorage.getItem('model')
    const template = sessionStorage.getItem('template')
    dispatch(setModel(model ?? ''))
    dispatch(setTemplate(template ?? ''))
  }, [dispatch])

  /**
   * Render
   */
  return (
    <div id="autoSave" className={style.autoSave}>
      <Tooltip
        title={
          'Auto-save' +
          (disabled ? ' (Essential privacy policy must be activated)' : '')
        }
      >
        <Switch
          size="small"
          disabled={disabled}
          checked={checked}
          checkedChildren="on"
          unCheckedChildren="off"
          onChange={onChecked}
        />
      </Tooltip>
      <Tooltip
        title={
          'Reload auto-saved' +
          (disabled ? ' (Essential privacy policy must be activated)' : '')
        }
      >
        <Button
          size="small"
          disabled={disabled}
          icon={<RedoOutlined />}
          onClick={onReload}
        />
      </Tooltip>
    </div>
  )
}

export default AutoSave
