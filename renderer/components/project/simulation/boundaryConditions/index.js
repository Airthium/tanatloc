import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Layout, Radio, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Formula from '../../../assets/formula'

import { useSelector, useDispatch } from 'react-redux'
import {
  enable,
  clear,
  setType,
  setPart,
  highlight,
  unhighlight,
  select,
  unselect
} from '../../../../store/select/action'

const BoundaryConditions = ({ project, simulation, part, setVisible }) => {
  // State
  const [bcVisible, setBcVisible] = useState(false)
  const [bcType, setBcType] = useState()

  // Store
  const { highlighted, selected } = useSelector((state) => ({
    highlighted: state.select.highlighted,
    selected: state.select.selected
  }))
  console.log(highlighted)
  console.log(selected)
  const dispatch = useDispatch()

  // Data
  const subScheme = simulation?.scheme.categories.boundaryConditions
  const radios = Object.keys(subScheme)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        ...subScheme[key]
      }
    })
    .filter((r) => r)

  // Selection
  useEffect(() => {
    dispatch(setType('face'))
    dispatch(setPart(part?.uuid))
  }, [part])

  const toggleBoundaryCondition = () => {
    if (bcVisible) dispatch(clear())
    else dispatch(enable())

    setVisible(bcVisible)
    setBcVisible(!bcVisible)
  }

  const addBoundaryCondition = () => {
    toggleBoundaryCondition()
  }

  const onType = (event) => {
    const type = event.target.value
    setBcType(subScheme[type])
  }

  const onHighlight = (face) => {
    dispatch(highlight(face?.uuid))
  }

  const onUnhighlight = () => {
    // dispatch(unhighlight())
  }

  const onSelect = (face) => {
    // if (selected.includes(face)) dispatch(unselect(face))
    // else dispatch(select(face))
  }

  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} onClick={addBoundaryCondition} />
        <Drawer
          title="Boundary condition"
          placement="left"
          closable={false}
          visible={bcVisible}
          mask={false}
          maskClosable={false}
          width={300}
        >
          <Card title="Boundary condition type">
            <Radio.Group buttonStyle="solid" onChange={onType}>
              {radios.map((radio) => {
                return (
                  <Radio.Button key={radio.key} value={radio.key}>
                    {radio.label}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          </Card>
          {bcType && (
            <Card>
              {bcType.children?.map((child, index) => {
                return (
                  <div key={index}>
                    {child.label}:
                    <Formula defaultValue={child.default} onChange={() => {}} />
                  </div>
                )
              })}
            </Card>
          )}
          <div>
            {part &&
              part.faces?.map((face, index) => {
                return (
                  <Card
                    hoverable
                    key={index}
                    style={{
                      marginBottom:
                        highlighted === face.uuid
                          ? '5px'
                          : selected.includes(face.uuid)
                          ? '5px'
                          : '7px',
                      border:
                        highlighted === face.uuid
                          ? '2px solid #0096C7'
                          : selected.includes(face.uuid)
                          ? '2px solid #c73100'
                          : '1px solid grey'
                    }}
                    bodyStyle={{ padding: '10px' }}
                    onMouseOver={() => onHighlight(face)}
                    onMouseOut={onUnhighlight}
                    onClick={() => onSelect(face)}
                  >
                    {face.name}
                  </Card>
                )
              })}
          </div>
          <Space>
            <Button type="danger" onClick={toggleBoundaryCondition}>
              Cancel
            </Button>
            <Button onClick={toggleBoundaryCondition}>Add</Button>
          </Space>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
