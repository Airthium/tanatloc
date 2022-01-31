import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
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
    Function
  ] = useState()
  const [toEdit, setToEdit]: [
    IConfiguration['initializations']['key'] & { key: string },
    Function
  ] = useState()

  useEffect(() => {
    setInitializations(configuration.initializations)
  }, [configuration])

  const onAdd = () => {}

  const setEdit = () => {}

  const onEdit = () => {}

  const onDelete = () => {}

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
            onEdit={onEdit}
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
