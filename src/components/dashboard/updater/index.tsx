import { useCallback, useEffect, useState } from 'react'
import { Space, Typography } from 'antd'

import Dialog from '@/components/assets/dialog'

import Update, { IUpdateTrue } from '@/lib/update'

/**
 * Updater
 * @returns Updater
 */
const Updater = (): JSX.Element => {
  const [needUpdate, setNeedUpdate] = useState<IUpdateTrue>()
  const [visible, setVisible] = useState<boolean>(false)

  // Github call
  useEffect(() => {
    Update.needUpdate()
      .then((res) => {
        if (res.needed) setNeedUpdate(res)
      })
      .catch(console.error)
  }, [])

  // Visible
  useEffect(() => {
    if (needUpdate?.needed) setVisible(true)
  }, [needUpdate])

  /**
   * On cancel
   */
  const onCancel = useCallback((): void => {
    setVisible(false)
  }, [])

  /**
   * On ok
   */
  const onOk = useCallback(async (): Promise<void> => {
    window.open(
      'https://github.com/Airthium/tanatloc-electron/releases/tag/' +
        needUpdate?.res.tag_name,
      '_blank',
      'top=500,left=200,frame=false,nodeIntegration=no'
    )
  }, [needUpdate])

  return (
    <>
      <Dialog
        visible={visible}
        title="Update"
        okButtonText="Update"
        onCancel={onCancel}
        onOk={onOk}
      >
        <Space direction="vertical">
          <Typography.Text>A new release is available</Typography.Text>
          <Typography.Text>
            Do you want to update to version{' '}
            <Typography.Text code>{needUpdate?.res.tag_name}</Typography.Text>?
          </Typography.Text>
        </Space>
      </Dialog>
    </>
  )
}

export default Updater
