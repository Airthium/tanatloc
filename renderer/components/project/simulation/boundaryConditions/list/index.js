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
  const boundaryConditions =
    simulation?.scheme?.configuration?.boundaryConditions || {}
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param {string} key Key
   * @param {number} index Index
   */
  const highlight = (key, index) => {
    dispatch(enable())
    const currentSelected = boundaryConditions[key]?.values[index]?.selected
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
  const list = Object.keys(boundaryConditions)
    .map((type) => {
      if (type === 'index' || type === 'title' || type === 'done') return
      return boundaryConditions[type].values?.map((child, index) => {
        return (
          <Card
            key={index}
            hoverable
            style={{ marginTop: '5px' }}
            onMouseEnter={() => highlight(type, index)}
            onMouseLeave={() => {
              enabled && unhighlight()
            }}
          >
            <Space direction="vertical">
              <Typography.Text>{child.name}</Typography.Text>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEnabled(false)
                    onEdit(type, index)
                    setTimeout(() => setEnabled(true), 500)
                  }}
                />
                <Delete
                  project={project}
                  simulation={simulation}
                  type={type}
                  index={index}
                />
              </Space>
            </Space>
          </Card>
        )
      })
    })
    .filter((l) => l)

  /**
   * Render
   */
  return list
}

export default List
