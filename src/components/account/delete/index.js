import { useState } from 'react'
import { Button, Card, Row, Col, Typography } from 'antd'

import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import UserAPI from '@/api/user'
import logout from '@/api/logout'

/**
 * Errors account/delete
 * @memberof module:renderer/components/account
 */
const errors = {
  delError: 'Unable to delete the user'
}

/**
 * Delete account
 * @memberof module:renderer/components/account
 */
const Delete = () => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [, { mutateUser }] = UserAPI.useUser()

  /**
   * Handle delete
   */
  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await UserAPI.del()

      // Logout
      await logout()

      // Mutate
      mutateUser({})
    } catch (err) {
      Error(errors.delError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Card
      className="Vertical-gutter"
      bodyStyle={{
        padding: '0 24px',
        minHeight: '48px'
      }}
    >
      <Row align="middle">
        <Col span={4}>
          <Typography.Title
            level={5}
            style={{ padding: '16px 0', margin: 0, fontWeight: 500 }}
          >
            Delete your account
          </Typography.Title>
        </Col>

        <Col span={20}>
          <Row>
            <Col offset={5}>
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                onClick={() => setVisible(true)}
              >
                Delete your account
              </Button>
              <DeleteDialog
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleDelete}
                loading={loading}
              >
                This action cannot be undone. If you delete your account, you
                will permanently lose your workspaces and projects.
              </DeleteDialog>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Delete
