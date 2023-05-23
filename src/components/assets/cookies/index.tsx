/** @module Components.Assets.Cookies */

import { CSSProperties, useCallback, useEffect, useRef } from 'react'
import { Button, Collapse, Form, Switch, Typography, notification } from 'antd'
import Icon from '@ant-design/icons'
import { useCookies } from 'react-cookie'

import style from './index.module.css'

/**
 * Props
 */
export interface ICookieIconProps {
  style?: CSSProperties
}

/**
 * CookieSvg
 * @returns CookieSvg
 */
const CookieSvg = () => (
  <svg
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M247.2 17c-22.1-3.1-44.6 .9-64.4 11.4l-74 39.5C89.1 78.4 73.2 94.9 63.4 115L26.7 190.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9 64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9l-14.6-82.8c-3.9-22.1-14.6-42.3-30.7-57.9L388.9 57.5c-16.1-15.6-36.6-25.6-58.7-28.7L247.2 17zM208 144a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM144 336a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm224-64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
  </svg>
)

/**
 * Cookie
 * @returns Cookie
 */
const CookieIcon = ({ style }: ICookieIconProps): React.JSX.Element => {
  return <Icon component={CookieSvg} style={{ fill: '#FAD114', ...style }} />
}

/**
 * Cookies
 * @returns Cookies
 */
const Cookies = (): React.JSX.Element => {
  // Ref
  const onlyOne = useRef<number>(0)

  // Cookies
  const [cookies, setCookie, removeCookie] = useCookies([
    'accepted',
    'gpdr-gtag-accept'
  ])

  // Notification
  const [api, contextHolder] = notification.useNotification()

  /**
   * On all
   */
  const onAll = useCallback(() => {
    setCookie('accepted', true, { maxAge: 3600 * 24 * 30 })
    setCookie('gpdr-gtag-accept', true, { maxAge: 3600 * 24 * 30 })
    api.destroy()
  }, [api, setCookie])

  /**
   * On close
   * @param values Values
   */
  const onClose = useCallback(
    (values: any): void => {
      if (values.accepted) {
        setCookie('accepted', true, { maxAge: 3600 * 24 * 30 })
        setCookie('gpdr-gtag-accept', !!values['gpdr-gtag-accept'], {
          maxAge: 3600 * 24 * 30
        })
      } else {
        removeCookie('accepted')
        removeCookie('gpdr-gtag-accept')
      }
      api.destroy()
    },
    [api, setCookie, removeCookie]
  )

  /**
   * Open agreement
   */
  const openAgreement = useCallback(() => {
    api.destroy()
    api.open({
      className: style.notification,
      placement: 'bottomRight',
      duration: 0,
      message: (
        <>
          <CookieIcon /> Privacy preferences
        </>
      ),
      description: (
        <div className={style.description}>
          <Typography.Text className={style.descriptionText}>
            This website gathers informations about how users interact with it,
            in order to continuously improve the service provided to you. Third
            party content may also be provided. Please confirm you are OK with
            this.
          </Typography.Text>
          <Collapse size="small" className={style.descriptionCollapse}>
            <Collapse.Panel key="details" header="More details">
              <Form
                className={style.descriptionForm}
                initialValues={{
                  accepted: cookies.accepted === 'true',
                  'gpdr-gtag-accept': cookies['gpdr-gtag-accept'] === 'true'
                }}
                size="small"
                colon={false}
                onFinish={onClose}
              >
                <Form.Item
                  label="Essential"
                  name="accepted"
                  valuePropName="checked"
                >
                  <Switch size="small" />
                </Form.Item>
                <Form.Item
                  label="Google Analytics"
                  name="gpdr-gtag-accept"
                  valuePropName="checked"
                >
                  <Switch size="small" />
                </Form.Item>
                <Form.Item>
                  <Button className={style.saveClose} htmlType="submit">
                    Save & Close
                  </Button>
                </Form.Item>
              </Form>
            </Collapse.Panel>
          </Collapse>
          <Button type="primary" onClick={onAll}>
            Accept all
          </Button>
        </div>
      )
    })
  }, [cookies, api, onAll, onClose])

  // Cookie agreement
  useEffect(() => {
    if (onlyOne.current === 0 && !cookies.accepted) {
      onlyOne.current = 1
      openAgreement()
    }
  }, [cookies, openAgreement])

  /**
   * Render
   */
  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<CookieIcon style={{ fill: 'white' }} />}
        className={style.button}
        onClick={openAgreement}
      />
    </>
  )
}

export default Cookies
