/** @module Components.Doc.Changelog */

import { ReactNode, useEffect, useState } from 'react'
import { Spin, Typography } from 'antd'

/**
 * Changelog
 * @returns Changelog
 */
const Changelog = (): ReactNode => {
  // State
  const [content, setContent] = useState<string>()

  // Load
  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/Airthium/tanatloc/master/CHANGELOG.md'
        )
        let changelog = await res.text()
        setContent(changelog)
      } catch (err: any) {
        setContent(
          'Unable to fetch CHANGELOG at https://github.com/Airthium/tanatloc/blob/master/CHANGELOG.md\n' +
            err.message
        )
      }
    }
    asyncFunction().catch(console.error)
  }, [])

  /**
   * Render
   */
  if (!content) return <Spin />
  return (
    <>
      <Typography.Title level={3}>CHANGELOG</Typography.Title>
      <Typography.Paragraph>
        <blockquote>
          <pre>{content}</pre>
        </blockquote>
      </Typography.Paragraph>
    </>
  )
}

export default Changelog
