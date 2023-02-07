/** @module Components.Blog.Posts.Layout */

import { GoBack } from '@/components/assets/button'
import { Tag, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import Utils from '@/lib/utils'

import { globalStyle } from '@/styles'
import style from '../../index.style'

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
  children
}: IProps): JSX.Element => {
  // Data
  const router = useRouter()

  /**
   * On go back
   */
  const onGoBack = useCallback(() => {
    router.push('/blog')
  }, [router])

  /**
   * Render
   */
  return (
    <div css={style.postLayout}>
      <div>
        <GoBack onClick={onGoBack} />
      </div>
      <div css={style.postTitle}>
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
          <Typography.Text css={globalStyle.textLight}>
            Tanatloc version {version}
          </Typography.Text>
        </div>
        <div>
          <img src={image} alt={title} />
        </div>
      </div>

      <div css={style.postContent}>{children}</div>
    </div>
  )
}

export default PostLayout
