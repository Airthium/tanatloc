/** @module Components.Footer */

import { ReactNode, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Button,
  Card,
  Divider,
  Layout,
  List,
  ListProps,
  Space,
  Typography
} from 'antd'

import packageJson from '../../../../package.json'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  scroll: (id: string) => void
}

/**
 * Footer
 * @returns Footer
 */
const Footer: React.FunctionComponent<IProps> = ({ scroll }) => {
  /**
   * Render item
   * @param item Item
   * @returns Render
   */
  const renderItem: ListProps<ReactNode>['renderItem'] = useCallback(
    (item: ReactNode): ReactNode => (
      <List.Item className="item">{item}</List.Item>
    ),
    []
  )

  /**
   * Scroll to features
   */
  const scrollToFeatures = useCallback((): void => scroll('features'), [scroll])

  /**
   * Scroll to doc
   */
  const scrollToDoc = useCallback((): void => {
    window.open('/doc', '_blank', 'noopener')
  }, [])

  /**
   * Scroll to blog
   */
  const scrollToBlog = useCallback((): void => {
    window.open('/blog', '_blank', 'noopener')
  }, [])

  /**
   * Scroll to developers
   */
  const scrollToDevelopers = useCallback((): void => {
    window.open('https://github.com/Airthium', '_blank', 'noopener')
  }, [])

  /**
   * Scroll to case study
   */
  const scrollToCaseStudy = useCallback(
    (): void => scroll('caseStudy'),
    [scroll]
  )

  /**
   * Scroll to get started
   */
  const scrollToGetStarted = useCallback(
    (): void => scroll('getStarted'),
    [scroll]
  )

  /**
   * Scroll to about us
   */
  const scrollToAboutUs = useCallback((): void => scroll('aboutUs'), [scroll])

  // Data
  const thanks = useMemo(
    () => [
      <>
        - Professor Fréderic Hecht, Dr. Pierre Jolivet, and the{' '}
        <Link href="https://freefem.org/" target="_blank">
          FreeFEM’s
        </Link>{' '}
        contributors
      </>,
      <>
        - Professor Christophe Geuzaine, Professor Jean-François Remacle and the{' '}
        <Link href="https://gmsh.info/" target="_blank">
          Gmsh
        </Link>{' '}
        contributors
      </>,
      <>
        - The{' '}
        <Link href="https://dev.opencascade.org/" target="_blank">
          Open Cascade
        </Link>{' '}
        development team
      </>
    ],
    []
  )

  const navigate = useMemo(
    () => [
      <Button key="features" type="text" onClick={scrollToFeatures}>
        Features
      </Button>,
      <Button key="case_studies" type="text" onClick={scrollToCaseStudy}>
        Case Studies
      </Button>,
      <Button key="about_us" type="text" onClick={scrollToAboutUs}>
        About us
      </Button>,
      <Button key="get_started" type="text" onClick={scrollToGetStarted}>
        Get started
      </Button>,
      <Button key="doc" type="text" onClick={scrollToDoc}>
        Doc
      </Button>,
      <Button key="blog" type="text" onClick={scrollToBlog}>
        Blog
      </Button>,
      <Button key="developers" type="text" onClick={scrollToDevelopers}>
        Developers
      </Button>
    ],
    [
      scrollToFeatures,
      scrollToDevelopers,
      scrollToCaseStudy,
      scrollToGetStarted,
      scrollToAboutUs,
      scrollToBlog,
      scrollToDoc
    ]
  )

  /**
   * Render
   */
  return (
    <Layout.Footer className={style.footer}>
      <div className={style.head}>
        <Card title="Thanks" className={style.card} bordered={false}>
          We would like to thanks:
          <List bordered={false} dataSource={thanks} renderItem={renderItem} />
          Without you this software would not have been possible.
        </Card>
        <Card title="Navigate" className={style.card} bordered={false}>
          <List dataSource={navigate} renderItem={renderItem} />
        </Card>
        <Card title="Contact" className={style.card} bordered={false}>
          <Space direction="vertical">
            <div>
              <a href="mailto:contact@airthium.com">
                <Button type="text">
                  <strong>contact@airthium.com</strong>
                </Button>
              </a>
              <br />
              <Typography.Text>for commercial inquiries</Typography.Text>
            </div>

            <div>
              <a
                href="https://github.com/Airthium/tanatloc/issues"
                target="_blank"
                rel="noreferrer"
              >
                <Button type="text">
                  <strong>Github Issues</strong>
                </Button>
              </a>
              <br />
              <Typography.Text>for support questions</Typography.Text>
            </div>
          </Space>
        </Card>
      </div>
      <Divider className={style.divider} />
      <div className={style.foot}>
        <img src="/images/logo.svg" alt="Tanatloc" />
        <Typography>
          Copyright© {new Date().getFullYear()} - version {packageJson.version}{' '}
          - Design by{' '}
          <a
            href="https://www.commeth.com/"
            target="_blank"
            rel="noreferrer"
            className={globalStyle.textDark}
          >
            Enora Duvivier
          </a>
        </Typography>
      </div>
    </Layout.Footer>
  )
}

export default Footer
