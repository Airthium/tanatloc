/** @module Components.Doc.Plugins */

import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Tabs, Typography } from 'antd'

import Carousel from '@/components/assets/carousel'

import style from '../index.module.css'

/**
 * HPC
 * @returns HPC
 */
const HPC = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>HPC Plugins</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>
          HPC plugins availability depends on your installation. Some plugins
          are part of a paid feature
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Local plugin</Typography.Title>
        <Typography.Text>
          Allow to compute a simulation directly on your computer with the
          Desktop application or on the frontal server in the web application
          (test purpose only!).
        </Typography.Text>
        <Typography.Text>
          By default, the Gmsh and FreeFEM executable in tanatloc/worker are
          directly used
        </Typography.Text>
        <Typography.Text>
          If you want to use a custom Gmsh or FreeFEM version, fill the
          corresponding path
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'local',
            src: 'doc/plugins_local.jpg',
            caption: 'Local plugin'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={4}>
          Rescale plugin (Pay-feature)
        </Typography.Title>
        <Typography.Text>
          Allow to compute a simulation on{' '}
          <a href="https://www.rescale.com/" target="_blank" rel="noreferrer">
            Rescale
          </a>
          .
        </Typography.Text>
        <Typography.Text>
          You have to fill the following informations:
          <ul>
            <li>Name: the name of your configuration</li>
            <li>Token: your Rescale API token</li>
            <li>Platform: the Rescale platform you use</li>
            <li>Default wall time: the default wall time</li>
            <li>Organization name [Optional]: the Rescale organization name</li>
            <li>Project id [Optional]: the Rescale project id</li>
            <li>
              Additional files [Optional]: additional C++ files to use as
              FreeFEM plugins
            </li>
          </ul>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'rescale',
            src: 'doc/plugins_rescale.jpg',
            caption: 'Rescale plugin'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={4}>
          Sharetask plugin (Pay-feature)
        </Typography.Title>
        <Typography.Text>
          Allow to compute a simulation using{' '}
          <Link href="https://www.anclab.com/sharetask-1/" target="_blank">
            ANCL ShareTask
          </Link>{' '}
          (Japanese)
        </Typography.Text>
        <Typography.Text>
          You have to fill the following informations:
          <ul>
            <li>Name: the name of your configuration</li>
            <li>Application name: the ShareTask FreeFEM identifier: FREEFEM</li>
            <li>Queue name: the ShareTask queue name</li>
            <li>User name: the ShareTask user name</li>
            <li>
              ShareTask launch script: The ShareTask launch script, that depends
              on your cluster architecture
            </li>
          </ul>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'sharetask',
            src: 'doc/plugins_sharetask.jpg',
            caption: 'Sharetask plugin'
          }
        ]}
      />
    </>
  )
}

/**
 * Model
 * @returns Model
 */
const Model = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Model Plugins</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>
          Model plugins allow to add specific algorithms to the already existing
          Tanatloc algorithms. It is a pay feature
        </Typography.Text>
      </Typography>
    </>
  )
}

/**
 * Tabs
 */
const tabs = [
  {
    key: 'hpc',
    label: 'HPC plugins',
    children: <HPC />
  },
  {
    key: 'model',
    label: 'Model plugins',
    children: <Model />
  }
]

/**
 * Plugins
 * @returns Plugins
 */
const Plugins = (): React.JSX.Element => {
  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string) => {
      ;(async () => {
        await router.push({
          pathname: '/doc',
          query: {
            section: 'plugins',
            tab: key
          }
        })
      })()
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={3}>Plugins</Typography.Title>

      <Tabs
        activeKey={(query.tab as string) ?? 'hpc'}
        items={tabs}
        onChange={onChange}
      />
    </>
  )
}

export default Plugins
