import PropTypes from 'prop-types'
import { Button, Card, Layout } from 'antd'

import { IConfiguration } from '..'

import Material from './material'
import List from './list'
import { useEffect, useState } from 'react'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ materials }) => void
}

/**
 * Materials
 * @param props Props
 * @returns
 */
const Materials = ({ configuration, onNext }: IProps): JSX.Element => {
  const [materials, setMaterials]: [
    IConfiguration['materials']['children'],
    Function
  ] = useState()
  const [toEdit, setToEdit]: [
    IConfiguration['materials']['children'][0] & { index: number },
    Function
  ] = useState()

  useEffect(() => {
    setMaterials(configuration.materials?.children)
  }, [configuration])

  /**
   * On add
   * @param material Material
   */
  const onAdd = (material: IConfiguration['materials']['children'][0]) => {
    const newMaterials = [...(materials || [])]
    newMaterials.push(material)

    setMaterials(newMaterials)
  }

  /**
   * Set edit
   * @param index Index
   */
  const setEdit = (index: number) => {
    const material = materials[index]
    setToEdit({
      index,
      ...material
    })
  }

  /**
   * On edit
   * @param material Material
   */
  const onEdit = (material: IConfiguration['materials']['children'][0]) => {
    const index = toEdit.index
    console.log(index)

    const newMaterials = [
      ...materials.slice(0, index),
      material,
      ...materials.slice(index + 1)
    ]

    setToEdit()
    setMaterials(newMaterials)
  }

  /**
   * On delete
   * @param index Index
   */
  const onDelete = (index: number) => {
    const newMaterials = [
      ...materials.slice(0, index),
      ...materials.slice(index + 1)
    ]

    setMaterials(newMaterials)
  }

  /**
   * On next click
   */
  const onClick = () => {
    onNext({ materials: { children: materials } })
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          {toEdit ? (
            <Material material={toEdit} onEdit={onEdit} />
          ) : (
            <Material onAdd={onAdd} />
          )}
          <List materials={materials} onEdit={setEdit} onDelete={onDelete} />
          <Button type="primary" onClick={onClick}>
            Next
          </Button>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Materials.propTypes = {
  configuration: PropTypes.shape({
    materials: PropTypes.exact({
      children: PropTypes.array
    })
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default Materials
