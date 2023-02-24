/** @module Components.Administration.Registration */

import { useCallback, useEffect } from 'react'
import { Button, Card, Checkbox, Form, InputNumber, Space } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { IFrontSystem, IFrontMutateSystem } from '@/api/index.d'

import {
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
} from '@/config/auth'

import Loading from '@/components/loading'
import {
  SuccessNotification,
  ErrorNotification
} from '@/components/assets/notification'

import SystemAPI from '@/api/system'

import globalStyle from '@/styles/index.module.css'

/**
 * Errors
 */
export const errors = {
  system: 'Error while loading system',
  update: 'Unable to update system'
}

/**
 * On allow signup
 * @param system System
 * @param mutateSystem Mutate system
 */
export const _onAllowSignup = async (
  system: IFrontSystem,
  mutateSystem: (system: IFrontMutateSystem) => void
): Promise<void> => {
  try {
    // Update
    await SystemAPI.update([{ key: 'allowsignup', value: !system.allowsignup }])

    // Mutate
    mutateSystem({ allowsignup: !system.allowsignup })

    SuccessNotification('Changes saved')
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On password
 * @param values Values
 * @param mutateSystem Mutate system
 */
export const _onPasswordFinish = async (
  values: IFrontSystem['password'],
  mutateSystem: (system: IFrontMutateSystem) => void
): Promise<void> => {
  try {
    // Update
    await SystemAPI.update([{ key: 'password', value: values }])

    // Mutate
    mutateSystem({ password: values })

    SuccessNotification('Changes saved')
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Registration
 * @returns Registration
 */
const Registration = (): JSX.Element => {
  // Data
  const [form] = Form.useForm()
  const [system, { mutateSystem, errorSystem, loadingSystem }] =
    SystemAPI.useSystem()

  // System error
  useEffect(() => {
    if (errorSystem) ErrorNotification(errors.system, errorSystem)
  }, [errorSystem])

  // Update field value
  useEffect(() => {
    if (!loadingSystem)
      form.setFieldsValue(
        system?.password || {
          min: MIN_SIZE,
          max: MAX_SIZE,
          requireLetter: REQUIRE_LETTER,
          requireNumber: REQUIRE_NUMBER,
          requireSymbol: REQUIRE_SYMBOL
        }
      )
  }, [loadingSystem, form, system?.password])

  /**
   * On Change
   */
  const onChange = useCallback(
    () => _onAllowSignup(system, mutateSystem),
    [system, mutateSystem]
  )

  /**
   * On Finish
   * @param values Values
   * @returns
   */
  const onFinish = useCallback(
    async (values: IFrontSystem['password']) =>
      _onPasswordFinish(values, mutateSystem),
    [mutateSystem]
  )

  /**
   * Render
   */
  if (loadingSystem) return <Loading.Simple />
  return (
    <Space direction="vertical" className={globalStyle.fullWidth} size={20}>
      <Card title="Signup">
        <Checkbox checked={system?.allowsignup} onChange={onChange}>
          Allow signup
        </Checkbox>
      </Card>

      <Card title="Password">
        <Form
          form={form}
          name="form"
          onFinish={onFinish}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div
            className={`${globalStyle.displayFlex} ${globalStyle.fullWidth}`}
            style={{ justifyContent: 'space-between' }}
          >
            <div>
              <Form.Item
                label="Minimum number of characters"
                name="min"
                rules={[
                  {
                    required: true,
                    message: 'Minimum number of characters is required'
                  }
                ]}
              >
                <InputNumber min={0} max={64} />
              </Form.Item>
              <Form.Item
                label="Maximum number of characters"
                name="max"
                rules={[
                  {
                    required: true,
                    message: 'Maximum number of characters is required'
                  }
                ]}
              >
                <InputNumber min={0} max={64} />
              </Form.Item>
            </div>
            <div>
              <Form.Item valuePropName="checked" name="requireLetter">
                <Checkbox>Require letter</Checkbox>
              </Form.Item>
              <Form.Item valuePropName="checked" name="requireNumber">
                <Checkbox>Require number</Checkbox>
              </Form.Item>
              <Form.Item valuePropName="checked" name="requireSymbol">
                <Checkbox>Require symbol</Checkbox>
              </Form.Item>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  htmlType="submit"
                >
                  Save changes
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
    </Space>
  )
}

export default Registration
