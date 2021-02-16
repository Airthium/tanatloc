import { useState } from 'react'
import { Card, Checkbox } from 'antd'

const Registration = () => {
  // State
  const [allowSignup, setAllowSignup] = useState()

  /**
   * On allow signup
   */
  const onAllowSignup = () => {
    setAllowSignup(!allowSignup)
    //TODO
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
