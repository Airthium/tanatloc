/** @module Components.Blog */

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Empty, Input, Layout, Tag, Typography } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import packageJson from '../../../package.json'

import Utils from '@/lib/utils'

import Posts from './posts'

import style from './index.style'
import { globalStyle } from '@/styles'

/**
 * Post card interface
 */
export interface IPostCardProps {
  postKey: string
  title: string
  date: string
  image: string
  description: string
  keywords: string[]
  author: { name: string; url: string }
}

/**
 * PostCard
 * @param props Props
 * @returns PostCard
 */
const PostCard = ({
  postKey,
  title,
  date,
  image,
  description,
  keywords,
  author
}: IPostCardProps): JSX.Element => {
  // Data
  const router = useRouter()

  /**
   * On click
   */
  const onClick = useCallback(() => {
    router.push({
      pathname: '/blog',
      query: { post: postKey }
    })
  }, [router, postKey])

  /**
   * Renderer
   */
  return (
    <Card
      css={style.postCard}
      title={title}
      hoverable
      onClick={onClick}
      cover={<img src={image} alt={title} />}
      extra={
        <>
          <Typography.Text>{author.name}</Typography.Text>
          <br />
          <Typography.Text css={globalStyle.textLight}>
            {new Date(date).toLocaleDateString()}
          </Typography.Text>
        </>
      }
      actions={[
        keywords.map((keyword) => (
          <Tag color={Utils.stringToColor(keyword)} key={keyword}>
            {keyword}
          </Tag>
        ))
      ]}
    >
      {description}
    </Card>
  )
}

/**
 * Blog
 * @returns Blog
 */
const Blog = () => {
  // State
  const [PostRender, setPostRender] = useState<JSX.Element>()
  const [search, setSearch] = useState<string>()
  const [sort, setSort] = useState<number>(1)

  // Data
  const router = useRouter()
  const { post } = router.query

  // Init
  useEffect(() => {
    if (post) {
      const Post = Posts.find((p) => p.key === post)
      if (Post) setPostRender(Post.default)
    } else setPostRender(undefined)
  }, [post])

  /**
   * On tanatloc
   */
  const onTanatloc = useCallback(() => {
    router.push('/')
  }, [router])

  /**
   * On search
   * @param e Event
   */
  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setSearch(value)
  }, [])

  /**
   * On sort down
   */
  const onSortDown = useCallback(() => {
    setSort(1)
  }, [])

  /**
   * On sort up
   */
  const onSortUp = useCallback(() => {
    setSort(-1)
  }, [])

  // Posts
  Posts.sort(
    (a, b) => sort * (new Date(a.date).getDate() - new Date(b.date).getDate())
  )
  const postsList = Posts.map((Post) => {
    if (search && !Post.title.toLowerCase().includes(search.toLowerCase()))
      return
    return (
      <PostCard
        key={Post.key}
        postKey={Post.key}
        title={Post.title}
        date={Post.date}
        image={Post.image}
        description={Post.description}
        keywords={Post.keywords}
        author={Post.author}
      />
    )
  }).filter((p) => p)

  /**
   * Render
   */
  return (
    <Layout css={globalStyle.noScroll}>
      <Layout.Header css={style.header}>
        <img
          css={style.logo}
          src="/images/logo.svg"
          alt="Tanatloc"
          onClick={onTanatloc}
        />
        <Typography.Title level={1}>Blog</Typography.Title>
      </Layout.Header>
      {PostRender ? (
        <Layout.Content css={css([globalStyle.scroll, style.content])}>
          {PostRender}
        </Layout.Content>
      ) : (
        <Layout.Content css={css([globalStyle.scroll, style.content])}>
          <div css={style.contentTools}>
            <div>
              Sort by date
              <div>
                <Button icon={<ArrowDownOutlined />} onClick={onSortDown} />
                <Button icon={<ArrowUpOutlined />} onClick={onSortUp} />
              </div>
            </div>
            <Input placeholder="Search" value={search} onChange={onSearch} />
          </div>
          <div css={style.posts}>
            {postsList.length ? postsList : <Empty />}
          </div>
        </Layout.Content>
      )}
      <Layout.Footer css={style.footer}>
        Copyright© {new Date().getFullYear()} - version {packageJson.version}
      </Layout.Footer>
    </Layout>
  )
}

export default Blog
