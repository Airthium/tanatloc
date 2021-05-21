import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Space, Typography } from 'antd'

import { EditButton } from '@/components/assets/button'
import Delete from '../delete'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '@/store/select/action'

/**
 * List materials
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const List = ({ simulation, swr, onEdit }) => {
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
          className="material-item"
          key={index}
          hoverable
          style={{ marginTop: '5px' }}
          onMouseEnter={() => highlight(index)}
          onMouseLeave={() => {
            enabled && unhighlight()
          }}
        >
          <Space
            direction=""
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography.Text>{material.material.label}</Typography.Text>
            <Space direction="">
              <EditButton
                onEdit={() => {
                  setEnabled(false)
                  onEdit(index)
                  setTimeout(() => setEnabled(true), 500)
                }}
              />
              <Delete simulation={simulation} index={index} swr={swr} />
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

List.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
        })
      })
    })
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }),
  onEdit: PropTypes.func.isRequired
}

export default List
