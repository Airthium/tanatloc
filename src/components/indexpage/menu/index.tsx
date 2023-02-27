/** @module Components.Index.Menu */

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Button, Layout, Menu, Popover } from 'antd'
import { BarsOutlined } from '@ant-design/icons'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

import UserAPI from '@/api/user'

import globalStyle from '@/styles/index.module.css'
import style from '../index.module.css'

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
 * IndexMenu
 * @returns IndexMenu
 */
const IndexMenu = () => {
  // Data
  const router = useRouter()
  const [user, { loadingUser }] = UserAPI.useUser()

  /**
   * Get started
   */
  const getStarted = useCallback((): void => {
    if (process.env.NEXT_PUBLIC_SERVER_MODE === 'frontpage') {
      scrollToView('getStarted')
    } else {
      router.push('/signup')
    }
  }, [router])

  /**
   * To dashboard
   */
  const toDashboard = useCallback((): void => {
    router.push('/dashboard')
  }, [router])

  /**
   * Scroll to features
   */
  const scrollToFeatures = useCallback(() => scrollToView('features'), [])

  /**
   * Scroll to developers
   */
  const scrollToDevelopers = useCallback(
    () => window.open('https://github.com/Airthium', '_blank', 'noopener'),
    []
  )

  /**
   * Scroll to blog
   */
  const scrollToBlog = useCallback(
    () => window.open('/blog', '_blank', 'noopener'),
    []
  )

  /**
   * Scroll to doc
   */
  const scrollToDoc = useCallback(
    () => window.open('/doc', '_blank', 'noopener'),
    []
  )

  /**
   * Scroll to case study
   */
  const scrollToCaseStudy = useCallback(() => scrollToView('caseStudy'), [])

  /**
   * Scroll to about us
   */
  const scrollToAboutUs = useCallback(() => scrollToView('aboutUs'), [])

  /**
   * To login
   */
  const toLogin = useCallback((): void => {
    router.push('/login')
  }, [router])

  // Get started button
  const getStartedButton = useMemo(() => {
    if (!user)
      return (
        <Button
          // className={css({ [mediaQuery]: { width: '100%' } })}//TODO
          type="primary"
          onClick={getStarted}
        >
          Get Started
        </Button>
      )
  }, [user, getStarted])

  // Login button
  const loginButton = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' && !loadingUser) {
      if (user)
        return (
          <Button type="primary" onClick={toDashboard}>
            Dashboard
          </Button>
        )
      else
        return (
          <Button
            className={globalStyle.noBorder}
            // { [mediaQuery]: { width: '100%' } }  // TODO
            onClick={toLogin}
          >
            Login
          </Button>
        )
    }
  }, [user, loadingUser, toDashboard, toLogin])

  // Menu
  const menuItems = useMemo(
    () =>
      [
        {
          key: 'features',
          label: (
            <Button type="text" onClick={scrollToFeatures}>
              Features
            </Button>
          )
        },
        {
          key: 'caseStudy',
          label: (
            <Button type="text" onClick={scrollToCaseStudy}>
              Case Studies
            </Button>
          )
        },
        {
          key: 'aboutUs',
          label: (
            <Button type="text" onClick={scrollToAboutUs}>
              About us
            </Button>
          )
        },
        {
          key: 'doc',
          label: (
            <Button type="text" onClick={scrollToDoc}>
              Doc
            </Button>
          )
        },
        {
          key: 'blog',
          label: (
            <Button type="text" onClick={scrollToBlog}>
              Blog
            </Button>
          )
        },
        {
          key: 'developers',
          label: (
            <Button type="text" onClick={scrollToDevelopers}>
              Developers
            </Button>
          )
        },
        !user && {
          key: 'getStarted',
          label: getStartedButton,
          className: 'Menu-getStarted'
        },
        process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' &&
          !loadingUser && {
            key: 'login',
            label: loginButton,
            className: 'Menu-login'
          }
      ].filter((m) => m) as ItemType[],
    [
      user,
      loadingUser,
      getStartedButton,
      loginButton,
      scrollToFeatures,
      scrollToCaseStudy,
      scrollToAboutUs,
      scrollToDoc,
      scrollToBlog,
      scrollToDevelopers
    ]
  )

  /**
   * Render
   */
  return (
    <Layout.Header id="header" className={style.header}>
      <img src="/images/logo.svg" alt="Tanatloc" />
      <Menu mode="horizontal" className={style.menu} items={menuItems} />
      <div className={style.menuMobile}>
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
