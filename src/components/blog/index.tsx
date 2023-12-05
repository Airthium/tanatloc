/** @module Components.Blog */

import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
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
}: IPostCardProps): ReactNode => {
  // Data
  const router = useRouter()

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    const asyncFunction = async () => {
      await router.push({
        pathname: '/blog',
        query: { post: postKey }
      })
    }
    asyncFunction().catch(console.error)
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
const Blog = (): ReactNode => {
  // State
  const [postRender, setPostRender] = useState<ReactNode>()
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
  const onTanatloc = useCallback((): void => {
    const asyncFunction = async () => {
      await router.push('/')
    }
    asyncFunction().catch(console.error)
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
  const tagRender = useCallback((props: CustomTagProps): ReactElement => {
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
  const onTagsChange = useCallback((values: string[]): void => {
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
    (a, b) => sort * (new Date(a.date).getTime() - new Date(b.date).getTime())
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
        <Button className={style.logo} onClick={onTanatloc} />
        <Typography.Title level={1}>Blog</Typography.Title>
      </Layout.Header>
      {postRender ? (
        <Layout.Content className={`${globalStyle.scroll} ${style.content}`}>
          {postRender}
        </Layout.Content>
      ) : (
        <Layout.Content className={`${globalStyle.scroll} ${style.content}`}>
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
              style={{ width: '100%' }}
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
