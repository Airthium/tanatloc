import { useState, useEffect } from 'react'
import { Card, Checkbox } from 'antd'

import SystemAPI from '@/api/system'

import { Error } from '@/components/assets/notification'

const errors = {
  updateError: 'Unable to update system'
}

const Registration = () => {
  // State
  const [allowSignup, setAllowSignup] = useState()

  // Data
  useEffect(() => {
    SystemAPI.get(['allowsignup'])
      .then((res) => {
        setAllowSignup(res.allowsignup)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  /**
   * On allow signup
   */
  const onAllowSignup = async () => {
    try {
      // Update
      await SystemAPI.update([{ key: 'allowsignup', value: !allowSignup }])

      // State
      setAllowSignup(!allowSignup)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <Card title="Registration" className="Vertical-gutter">
      <Checkbox checked={allowSignup} onChange={onAllowSignup}>
        Allow signup
      </Checkbox>
    </Card>
  )
}

export default Registration
