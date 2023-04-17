/** @module Components.Start */

import { useEffect, useState } from 'react'
import { Typography } from 'antd'
import isElectron from 'is-electron'

import Loading from '../loading'

/**
 * Start
 * @returns Start
 */
const Start = () => {
  // State
  const [status, setStatus] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (isElectron()) {
      try {
        //@ts-ignore
        window.electronAPI.handleStatus((_: any, value: string[]) => {
          setStatus(value)
        })

        //@ts-ignore
        window.electronAPI.handleErrors((_: any, value: string[]) => {
          setErrors(value)
        })
      } catch (err: any) {
        setErrors((prev) => [err.message, ...prev])
      }
    }
  }, [])

  /**
   * Render
   */
  return (
    <>
      <Loading
        text={
          <Typography.Title level={3} style={{ margin: 0 }}>
            Tanatloc is starting, please wait...
          </Typography.Title>
        }
        status={status}
        errors={errors}
      />
    </>
  )
}

export default Start
