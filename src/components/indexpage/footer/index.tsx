/** @module Components.Footer */

import { useCallback, useMemo } from 'react'
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

import { globalStyle } from '@/styles'
import style from './index.style'

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
const Footer = ({ scroll }: IProps): JSX.Element => {
  /**
   * Render item
   * @param item Item
   * @returns Render
   */
  const renderItem: ListProps<string | JSX.Element>['renderItem'] = (
    item: string | JSX.Element
  ): JSX.Element => <List.Item>{item}</List.Item>

  /**
   * Scroll to features
   */
  const scrollToFeatures = useCallback(() => scroll('features'), [scroll])

  /**
   * Scroll to developers
   */
  const scrollToDevelopers = useCallback(
    () => window.open('https://github.com/Airthium', '_blank'),
    []
  )

  /**
   * Scroll to case study
   */
  const scrollToCaseStudy = useCallback(() => scroll('caseStudy'), [scroll])

  /**
   * Scroll to get started
   */
  const scrollToGetStarted = useCallback(() => scroll('getStarted'), [scroll])

  /**
   * Scroll to about us
   */
  const scrollToAboutUs = useCallback(() => scroll('aboutUs'), [scroll])

  // Data
  const thanks = useMemo(
    () => [
      '- Professor Fréderic Hecht, Dr. Pierre Jolivet, and the FreeFEM’s contributors',
      '- Professor Christophe Geuzaine, Professor Jean-François Remacle and the Gmsh contributors',
      '- The Open Cascade development team'
    ],
    []
  )

  const navigate = useMemo(
    () => [
      <Button key="features" type="text" onClick={scrollToFeatures}>
        Features
      </Button>,
      <Button key="developers" type="text" onClick={scrollToDevelopers}>
        Developers
      </Button>,
      <Button key="case_studies" type="text" onClick={scrollToCaseStudy}>
        Case Studies
      </Button>,
      <Button key="get_started" type="text" onClick={scrollToGetStarted}>
        Get started
      </Button>,
      <Button key="about_us" type="text" onClick={scrollToAboutUs}>
        About us
      </Button>
    ],
    [
      scrollToFeatures,
      scrollToDevelopers,
      scrollToCaseStudy,
      scrollToGetStarted,
      scrollToAboutUs
    ]
  )

  /**
   * Render
   */
  return (
    <Layout.Footer css={style.footer}>
      <div css={style.head}>
        <Card title="Thanks" css={style.card} bordered={false}>
          We would like to thanks:
          <List bordered={false} dataSource={thanks} renderItem={renderItem} />
          Without you this software would not have been possible.
        </Card>
        <Card title="Navigate" css={style.card} bordered={false}>
          <List dataSource={navigate} renderItem={renderItem} />
        </Card>
        <Card title="Contact" css={style.card} bordered={false}>
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
      <Divider css={style.divider} />
      <div css={style.foot}>
        <img src="/images/logo.svg" alt="Tanatloc" />
        <Typography>
          Copyright© {new Date().getFullYear()} - version {packageJson.version}{' '}
          - Design by{' '}
          <a
            href="https://www.commeth.com/"
            target="_blank"
            rel="noreferrer"
            css={globalStyle.textDark}
          >
            Enora Duvivier
          </a>
        </Typography>
      </div>
    </Layout.Footer>
  )
}

export default Footer
