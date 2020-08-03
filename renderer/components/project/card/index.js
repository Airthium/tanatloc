import { useState } from 'react'
import { Button, Card, Typography, Row, Col, Tag, Divider } from 'antd'
import {
  FormOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloudSyncOutlined
} from '@ant-design/icons'

import './index.css'

export default () => {
  const [title, setTitle] = useState('title')
  const [description, setDescription] = useState('')

  const onOpen = () => {
    console.log('open')
  }
  const onDelete = () => {
    console.log('delete')
  }

  return (
    <Col>
      <Card
        className="ProjectCard"
        hoverable
        bodyStyle={{ flexGrow: 10 }}
        extra={
          <Typography.Title
            level={4}
            editable={{ onChange: setTitle }}
            ellipsis={{ rows: 2 }}
          >
            {title}
          </Typography.Title>
        }
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
      >
        <div className="ProjectCard-tags">
          <Tag icon={<SyncOutlined spin />} color="processing">
            Running
          </Tag>
          <Tag icon={<CloudSyncOutlined />} color="success">
            Backed-up in the cloud
          </Tag>
        </div>
        <Typography.Paragraph
          editable={{ onChange: setDescription }}
          ellipsis={{ rows: 4 }}
        >
          {description}
        </Typography.Paragraph>
        <Divider />

        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Button
              block
              type="primary"
              size="default"
              icon={<FormOutlined />}
              onClick={onOpen}
            >
              Open
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              size="default"
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}
