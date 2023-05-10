/** @module Components.Doc.Changelog */

import { Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

/**
 * Changelog
 * @returns Changelog
 */
const Changelog = (): React.JSX.Element => {
  // State
  const [content, setContent] = useState<string>()

  // Load
  useEffect(() => {
    ;(async () => {
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
    })()
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
