import { useEffect, useState } from 'react'
import { Button, Card, Layout } from 'antd'

import List from './list'
import BoundaryCondition from './boundaryCondition'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ boundaryConditions }) => void
}

const BoundaryConditions = ({ configuration, onNext }: IProps): JSX.Element => {
  const [boundaryConditions, setBoundaryConditions]: [
    IConfiguration['boundaryConditions'],
    Function
  ] = useState()
  const [toEdit, setToEdit]: [
    IConfiguration['boundaryConditions']['key'] & { key: string },
    Function
  ] = useState()

  useEffect(() => {
    setBoundaryConditions(configuration.boundaryConditions)
  }, [configuration])

  /**
   * On add
   * @param boundaryCondition Boundary condition
   */
  const onAdd = (
    boundaryCondition: IConfiguration['boundaryConditions']['key']
  ): void => {
    const newBoundaryConditions = {
      ...(boundaryConditions || {}),
      [boundaryCondition.name]: boundaryCondition
    }

    setBoundaryConditions(newBoundaryConditions)
  }

  /**
   * Set edit
   * @param key Key
   */
  const setEdit = (key: string): void => {
    const boundaryCondition = boundaryConditions[key]
    setToEdit({
      key,
      ...boundaryCondition
    })
  }

  /**
   * On edit
   * @param boundaryCondition Boundary condition
   */
  const onEdit = (
    boundaryCondition: IConfiguration['boundaryConditions']['key']
  ): void => {
    const key = toEdit.key

    const newBoundaryConditions = {
      ...boundaryConditions,
      [key]: boundaryCondition
    }

    setToEdit()
    setBoundaryConditions(newBoundaryConditions)
  }

  /**
   * On delete
   * @param key Key
   */
  const onDelete = (key: string) => {
    delete boundaryConditions[key]
  }

  /**
   * On next click
   */
  const onClick = () => {
    onNext({ boundaryConditions })
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          {toEdit ? (
            <BoundaryCondition boundaryCondition={toEdit} onEdit={onEdit} />
          ) : (
            <BoundaryCondition onAdd={onAdd} />
          )}
          <List
            boundaryConditions={boundaryConditions}
            onEdit={setEdit}
            onDelete={onDelete}
          />
          <Button type="primary" onClick={onClick}>
            Next
          </Button>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
