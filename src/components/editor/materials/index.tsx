import PropTypes from 'prop-types'
import { Button, Card, Layout } from 'antd'

import { IConfiguration } from '..'

import Add from './add'
import List from './list'
import { useEffect, useState } from 'react'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ materials }) => void
}

const Materials = ({ configuration, onNext }: IProps): JSX.Element => {
  const [materials, setMaterials]: [
    IConfiguration['materials']['children'],
    Function
  ] = useState()

  useEffect(() => {
    setMaterials(configuration.materials?.children)
  }, [configuration])

  const onAdd = (material: IConfiguration['materials']['children'][0]) => {
    const newMaterials = [...(materials || [])]
    newMaterials.push(material)

    setMaterials(newMaterials)
  }

  console.log(materials)

  const onClick = () => {
    onNext({ materials: { children: materials } })
  }

  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Add onAdd={onAdd} />
          <List materials={materials} />
          <Button onClick={onClick}>Next</Button>
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
