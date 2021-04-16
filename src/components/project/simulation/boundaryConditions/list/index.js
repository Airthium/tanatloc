import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '@/store/select/action'

import Delete from '../delete'

const List = ({ simulation, swr, onEdit }) => {
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

  /**
   * Render
   */
  return Object.keys(boundaryConditions)
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
              <Space direction="">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEnabled(false)
                    onEdit(type, index)
                    setTimeout(() => setEnabled(true), 500)
                  }}
                />
                <Delete
                  simulation={simulation}
                  type={type}
                  index={index}
                  swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
                />
              </Space>
            </Space>
          </Card>
        )
      })
    })
    .filter((l) => l)
}

List.propTypes = {
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object
      })
    })
  }),
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
}

export default List
