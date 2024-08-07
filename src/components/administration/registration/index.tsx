/** @module Components.Administration.Registration */

import { useCallback, useContext, useEffect } from 'react'
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

import { NotificationContext } from '@/context/notification'
import { addError, addSuccess } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import Loading from '@/components/loading'

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
  mutateSystem: (system: IFrontMutateSystem) => Promise<void>
): Promise<void> => {
  // Update
  await SystemAPI.update([{ key: 'allowsignup', value: !system.allowsignup }])

  // Mutate
  await mutateSystem({ allowsignup: !system.allowsignup })
}

/**
 * On password
 * @param values Values
 * @param mutateSystem Mutate system
 */
export const _onPasswordFinish = async (
  values: IFrontSystem['password'],
  mutateSystem: (system: IFrontMutateSystem) => Promise<void>
): Promise<void> => {
  // Update
  await SystemAPI.update([{ key: 'password', value: values }])

  // Mutate
  await mutateSystem({ password: values })
}

/**
 * Registration
 * @returns Registration
 */
const Registration: React.FunctionComponent = () => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [form] = Form.useForm()
  const [system, { mutateSystem, errorSystem, loadingSystem }] =
    SystemAPI.useSystem()

  // System error
  useEffect(() => {
    if (errorSystem)
      dispatch(addError({ title: errors.system, err: errorSystem }))
  }, [errorSystem, dispatch])

  // Update field value
  useEffect(() => {
    if (!loadingSystem)
      form.setFieldsValue(
        system?.password ?? {
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
  const onChange = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await _onAllowSignup(system, mutateSystem)
        dispatch(addSuccess({ title: 'Changes saved' }))
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
      }
    })
  }, [system, mutateSystem, dispatch])

  /**
   * On Finish
   * @param values Values
   */
  const onFinish = useCallback(
    (values: IFrontSystem['password']): void => {
      asyncFunctionExec(async () => {
        try {
          await _onPasswordFinish(values, mutateSystem)
          dispatch(addSuccess({ title: 'Changes saved' }))
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [mutateSystem, dispatch]
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
