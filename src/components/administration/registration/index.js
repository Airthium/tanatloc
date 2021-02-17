import { Card, Checkbox } from 'antd'

import SystemAPI from '@/api/system'

import { Error } from '@/components/assets/notification'

const errors = {
  updateError: 'Unable to update system'
}

const Registration = () => {
  // Data
  const [system, { mutateSystem }] = SystemAPI.useSystem()

  /**
   * On allow signup
   */
  const onAllowSignup = async () => {
    try {
      // Update
      await SystemAPI.update([
        { key: 'allowsignup', value: !system.allowsignup }
      ])

      // Mutate
      mutateSystem({ allowSignup: !system.allowsignup })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <Card title="Registration" className="Vertical-gutter">
      <Checkbox checked={system?.allowsignup} onChange={onAllowSignup}>
        Allow signup
      </Checkbox>
    </Card>
  )
}

export default Registration
