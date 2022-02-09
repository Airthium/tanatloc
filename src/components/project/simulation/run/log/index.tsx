import { useEffect, useState } from 'react'
import { Button, Drawer, Tabs } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

import { ISimulationTask } from '@/database/index.d'

export interface IProps {
  steps: ISimulationTask[]
}

const Log = ({ steps }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [content, setContent]: [JSX.Element, Function] = useState()

  // Content
  useEffect(() => {
    const tabs = steps?.map((step) => (
      <Tabs.TabPane tab={step.label} key={step.label}></Tabs.TabPane>
    ))

    setContent(<Tabs></Tabs>)
  }, [steps])

  const onLog = () => {
    setVisible(true)
  }

  return (
    <>
      <Drawer
        title="Log"
        visible={visible}
        onClose={() => setVisible(false)}
        width={512}
      >
        {content}
      </Drawer>
      <Button
        icon={<FileTextOutlined />}
        onClick={() => onLog()}
        size="small"
      />
    </>
  )
}

export default Log
