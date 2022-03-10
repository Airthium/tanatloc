import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Card, Layout } from 'antd'

import { IConfiguration } from '..'

import Parameter from './parameter'
import List from './list'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ parameters }) => void
}

/**
 * Physical parameters
 * @param props Props
 */
const PhysicalParameters = ({ configuration, onNext }: IProps): JSX.Element => {
  // State
  const [parameters, setParameters]: [
    IConfiguration['parameters'],
    Dispatch<SetStateAction<IConfiguration['parameters']>>
  ] = useState()
  const [toEdit, setToEdit]: [
    IConfiguration['parameters']['key'] & { key: string },
    Dispatch<
      SetStateAction<IConfiguration['parameters']['key'] & { key: string }>
    >
  ] = useState()

  useEffect(() => {
    setParameters(configuration.parameters)
  }, [configuration])

  /**
   * On add
   * @param parameter Parameter
   */
  const onAdd = (parameter: IConfiguration['parameters']['key']): void => {
    const newParameters = {
      ...(parameters || {}),
      [parameter.name]: parameter
    }

    setParameters(newParameters)
  }

  /**
   * Set edit
   * @param key Key
   */
  const setEdit = (key: string): void => {
    const parameter = parameters[key]
    setToEdit({
      key,
      ...parameter
    })
  }

  /**
   * On edit
   * @param parameter Parameter
   */
  const onEdit = (parameter: IConfiguration['parameters']['key']): void => {
    const key = toEdit.key

    const newParameters = {
      ...parameters,
      [key]: parameter
    }

    setToEdit(null)
    setParameters(newParameters)
  }

  /**
   * On delete
   * @param key Key
   */
  const onDelete = (key: string) => {
    delete parameters[key]
  }

  /**
   * On next click
   */
  const onClick = () => {
    onNext({ parameters })
  }

  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          {toEdit ? (
            <Parameter parameter={toEdit} onEdit={onEdit} />
          ) : (
            <Parameter onAdd={onAdd} />
          )}
          <List parameters={parameters} onEdit={setEdit} onDelete={onDelete} />
          <Button type="primary" onClick={onClick}>
            Next
          </Button>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

PhysicalParameters.propTypes = {
  configuration: PropTypes.shape({
    numericalParameters: PropTypes.object
  }),
  onNext: PropTypes.func.isRequired
}

export default PhysicalParameters
