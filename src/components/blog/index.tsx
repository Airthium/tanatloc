/** @module Components.Blog */

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  Empty,
  Input,
  Layout,
  Select,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import packageJson from '../../../package.json'

import Utils from '@/lib/utils'

import Posts from './posts'

import style from './index.module.css'
import globalStyle from '@/styles/index.module.css'

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
      className={style.postCard}
      title={title}
      hoverable
      onClick={onClick}
      cover={<img src={image} alt={title} />}
      extra={
        <>
          <Typography.Text>{author.name}</Typography.Text>
          <br />
          <Typography.Text className={globalStyle.textLight}>
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
  const [sort, setSort] = useState<number>(1)
  const [tags, setTags] = useState<string[]>([])
  const [search, setSearch] = useState<string>()

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

  /**
   * Tag render
   * @param props Props
   * @returns Render
   */
  const tagRender = useCallback((props: CustomTagProps) => {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={Utils.stringToColor(value)}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }, [])

  /**
   * On tags change
   * @param values Values
   */
  const onTagsChange = useCallback((values: string[]) => {
    setTags(values)
  }, [])

  // Tags
  const postsTags = useMemo(() => {
    const keywords: string[] = Posts.map((Post) => Post.keywords).flatMap(
      (k) => k
    )
    const uniqueKeywords = keywords.filter((keyword, index) => {
      return keywords.indexOf(keyword) === index
    })

    return uniqueKeywords.map((keyword) => ({
      label: keyword,
      value: keyword
    }))
  }, [])

  // Posts
  Posts.sort(
    (a, b) => sort * (new Date(a.date).getDate() - new Date(b.date).getDate())
  )
  const postsList = Posts.map((Post) => {
    if (search && !Post.title.toLowerCase().includes(search.toLowerCase()))
      return
    if (
      tags.length &&
      !Post.keywords.filter((keywords) => tags.includes(keywords)).length
    )
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
    <Layout className={globalStyle.noScroll}>
      <Layout.Header className={style.header}>
        <img
          className={style.logo}
          src="/images/logo.svg"
          alt="Tanatloc"
          onClick={onTanatloc}
        />
        <Typography.Title level={1}>Blog</Typography.Title>
      </Layout.Header>
      {PostRender ? (
        <Layout.Content className={globalStyle.scroll + ' ' + style.content}>
          {PostRender}
        </Layout.Content>
      ) : (
        <Layout.Content className={globalStyle.scroll + ' ' + style.content}>
          <div className={style.contentTools}>
            <div>
              Sort by date:
              <Tooltip title="Older to newer">
                <Button icon={<ArrowDownOutlined />} onClick={onSortUp} />
              </Tooltip>
              <Tooltip title="Newer to older">
                <Button icon={<ArrowUpOutlined />} onClick={onSortDown} />
              </Tooltip>
            </div>
            <Select
              options={postsTags}
              value={tags}
              tagRender={tagRender}
              mode="tags"
              placeholder="Select tags..."
              maxTagCount="responsive"
              onChange={onTagsChange}
            />
            <Input placeholder="Search" value={search} onChange={onSearch} />
          </div>
          <div className={style.posts}>
            {postsList.length ? postsList : <Empty />}
          </div>
        </Layout.Content>
      )}
      <Layout.Footer className={style.footer}>
        Copyright© {new Date().getFullYear()} - version {packageJson.version}
      </Layout.Footer>
    </Layout>
  )
}

export default Blog
