/** @module Components.Blog.Posts.Layout */

import { GoBack } from '@/components/assets/button'
import { Tag, Typography } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback } from 'react'

import Utils from '@/lib/utils'

import globalStyle from '@/styles/index.module.css'
import style from '../../index.module.css'

// Local interface
export interface IReference {
  code: string
  author: string
  date: string
  label: string
  journal?: string
  url?: string
}

/**
 * Props
 */
export interface IProps {
  title: string
  date: string
  image: string
  keywords: string[]
  author: {
    name: string
    url: string
  }
  version: string
  children: any
  references?: IReference[]
}

/**
 * Ref
 * @param props Props
 * @returns Ref
 */
export const Ref = ({ code }: { code: string }): React.JSX.Element => {
  return (
    <Link href={'#' + code}>
      <i>[{code}]</i>
    </Link>
  )
}

/**
 * PostLayout
 * @param props Props
 * @returns PostLayout
 */
const PostLayout = ({
  title,
  date,
  image,
  keywords,
  author,
  version,
  children,
  references
}: IProps): React.JSX.Element => {
  // Data
  const router = useRouter()

  /**
   * On go back
   */
  const onGoBack = useCallback(() => {
    ;(async () => {
      await router.push('/blog')
    })()
  }, [router])

  /**
   * Render
   */
  return (
    <div className={style.postLayout}>
      <div>
        <GoBack onClick={onGoBack} />
      </div>
      <div className={style.postTitle}>
        <div>
          <Typography.Title level={2}>{title}</Typography.Title>
          <Typography.Text>
            {new Date(date).toLocaleDateString()}
          </Typography.Text>
          <br />
          <a href={author.url} target="_blank" rel="noreferrer">
            <Typography.Text>{author.name}</Typography.Text>
          </a>
          <br />
          {keywords.map((keyword) => (
            <Tag color={Utils.stringToColor(keyword)} key={keyword}>
              {keyword}
            </Tag>
          ))}
          <br />
          <Typography.Text className={globalStyle.textLight}>
            Tanatloc version {version}
          </Typography.Text>
        </div>
        <div>
          <img src={image} alt={title} />
        </div>
      </div>

      <div className={style.postContent}>{children}</div>

      {references?.length ? (
        <section>
          <Typography.Title level={4}>References</Typography.Title>
          {references.map((reference) => (
            <div key={reference.code} id={reference.code}>
              <i>[{reference.code}]</i> - {reference.author} ({reference.date})
              - {reference.label}
              {reference.journal ? (
                <>
                  <br />
                  {reference.journal}
                </>
              ) : null}
              {reference.url ? (
                <>
                  <br />
                  <Link href={reference.url} target="_blank" />
                </>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}
    </div>
  )
}

export default PostLayout
