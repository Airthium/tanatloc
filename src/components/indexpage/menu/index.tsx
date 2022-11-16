import { NextRouter, useRouter } from 'next/router'
import { Button, Layout, Menu, Popover } from 'antd'
import { BarsOutlined } from '@ant-design/icons'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

import UserAPI from '@/api/user'

/**
 * Scroll to view
 * @param id
 */
export const scrollToView = (id: string): void => {
  const header = document.getElementById('header')
  const target = document.getElementById(id)

  const index = document.getElementById('index')
  if (target && header) {
    const y = target?.offsetTop - header?.offsetHeight - 10
    index?.scrollTo?.({ top: y, behavior: 'smooth' })
  }
}

/**
 * Get started
 * @param router Router
 */
export const getStarted = (router: NextRouter) => {
  if (process.env.NEXT_PUBLIC_SERVER_MODE === 'frontpage') {
    scrollToView('getStarted')
  } else {
    router.push('/signup')
  }
}

const IndexMenu = () => {
  // Data
  const router = useRouter()
  const [user, { loadingUser }] = UserAPI.useUser()

  // Get started button
  let getStartedButton = null
  if (!user)
    getStartedButton = (
      <Button
        className="Index-getstarted"
        type="primary"
        onClick={() => getStarted(router)}
      >
        Get Started
      </Button>
    )

  // Login button
  let loginButton = null
  if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' && !loadingUser) {
    if (user)
      loginButton = (
        <Button
          type="primary"
          className="Index-login-button"
          onClick={() => router.push('/dashboard')}
        >
          Dashboard
        </Button>
      )
    else
      loginButton = (
        <Button
          className="Index-login-button"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
      )
  }

  // Menu
  const menuItems = [
    {
      key: 'features',
      label: (
        <Button type="text" onClick={() => scrollToView('features')}>
          Features
        </Button>
      )
    },
    {
      key: 'caseStudy',
      label: (
        <Button type="text" onClick={() => scrollToView('caseStudy')}>
          Case Studies
        </Button>
      )
    },
    {
      key: 'aboutUs',
      label: (
        <Button type="text" onClick={() => scrollToView('aboutUs')}>
          About us
        </Button>
      )
    },
    {
      key: 'developers',
      label: (
        <Button
          type="text"
          onClick={() => window.open('https://github.com/Airthium', '_blank')}
        >
          Developers
        </Button>
      )
    },
    !user && { key: 'getStarted', label: getStartedButton },
    process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' &&
      !loadingUser && { key: 'login', label: loginButton }
  ].filter((m) => m) as ItemType[]

  /**
   * Render
   */
  return (
    <Layout.Header id="header" className="Index-Header">
      <img src="/images/logo.svg" alt="Tanatloc" />
      <Menu mode="horizontal" className="Index-Menu" items={menuItems} />
      <div className="Index-Menu-mobile">
        <Popover
          content={<Menu mode="inline" items={menuItems} />}
          placement="leftBottom"
        >
          <BarsOutlined style={{ fontSize: 32 }} />
        </Popover>
      </div>

      {getStartedButton}
      {loginButton}
    </Layout.Header>
  )
}

export default IndexMenu
