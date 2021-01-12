import { useState } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '../../../../../store/select/action'

import Delete from '../delete'

const List = ({ project, simulation, onEdit }) => {
  // State
  const [enabled, setEnabled] = useState(true)

  // Data
  const materials = simulation?.scheme?.configuration?.materials || {}
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param {number} index Index
   */
  const highlight = (index) => {
    dispatch(enable())
    const currentSelected = materials?.values[index]?.selected
    currentSelected?.forEach((s) => {
      dispatch(select(s.uuid))
    })
  }

  /**
   * Unhighlight current
   */
  const unhighlight = () => {
    dispatch(disable())
  }

  // List
  const list = materials.values
    ?.map((material, index) => {
      return (
        <Card
          key={index}
          hoverable
          style={{ marginTop: '5px' }}
          onMouseEnter={() => highlight(index)}
          onMouseLeave={() => {
            enabled && unhighlight()
          }}
        >
          <Space direction="vertical">
            <Typography.Text>{material.material.label}</Typography.Text>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setEnabled(false)
                  onEdit(index)
                  setTimeout(() => setEnabled(true), 500)
                }}
              />
              <Delete project={project} simulation={simulation} index={index} />
            </Space>
          </Space>
        </Card>
      )
    })
    .filter((l) => l)

  /**
   * Render
   */
  return list || null
}

export default List
