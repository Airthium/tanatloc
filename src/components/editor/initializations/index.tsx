import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Card, Layout } from 'antd'

import { IConfiguration } from '..'

import List from './list'
import Initialization from './initialization'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ initializations }) => void
}

/**
 * Initialization
 * @param props Props
 */
const Initializations = ({ configuration, onNext }: IProps): JSX.Element => {
  // State
  const [initializations, setInitializations]: [
    IConfiguration['initializations'],
    Dispatch<SetStateAction<IConfiguration['initializations']>>
  ] = useState()
  const [toEdit, setToEdit]: [
    IConfiguration['initializations']['key'] & { key: string },
    Dispatch<
      SetStateAction<IConfiguration['initializations']['key'] & { key: string }>
    >
  ] = useState()

  useEffect(() => {
    setInitializations(configuration.initializations)
  }, [configuration])

  /**
   * On add
   * @param initialization Initialization
   */
  const onAdd = (
    initialization: IConfiguration['initializations']['key']
  ): void => {
    const newInitializations = {
      ...(initializations || {}),
      [initialization.name]: initialization
    }

    setInitializations(newInitializations)
  }

  /**
   * Set edit
   * @param key Key
   */
  const setEdit = (key: string): void => {
    const initialization = initializations[key]
    setToEdit({
      key,
      ...initialization
    })
  }

  /**
   * On edit
   * @param initialization Initialization
   */
  const onEdit = (
    initialization: IConfiguration['initializations']['key']
  ): void => {
    const key = toEdit.key

    const newInitializations = {
      ...initializations,
      [key]: initialization
    }

    setToEdit(null)
    setInitializations(newInitializations)
  }

  /**
   * On delete
   * @param key Key
   */
  const onDelete = (key: string): void => {
    delete initializations[key]
  }

  /**
   * On next click
   */
  const onClick = () => {
    onNext({ initializations })
  }

  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          {toEdit ? (
            <Initialization initialization={toEdit} onEdit={onEdit} />
          ) : (
            <Initialization onAdd={onAdd} />
          )}
          <List
            initializations={initializations}
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

Initializations.propTypes = {
  configuration: PropTypes.shape({
    initializations: PropTypes.object
  }),
  onNext: PropTypes.func.isRequired
}

export default Initializations
