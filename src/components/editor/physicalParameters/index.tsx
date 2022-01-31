import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Button, Card, Layout } from 'antd'

import { IConfiguration } from '..'

import Parameter from './parameter'
import List from './list'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ numericalParameters }) => void
}

const PhysicalParameters = ({ configuration, onNext }: IProps): JSX.Element => {
  // State
  const [parameters, setParameters]: [
    IConfiguration['parameters']['key'],
    Function
  ] = useState()
  const [toEdit, setToEdit]: [IConfiguration['parameters']['key'], Function] =
    useState()

  useEffect(() => {
    setParameters(configuration.parameters)
  }, [configuration])

  const onAdd = () => {}

  const setEdit = () => {}

  const onDelete = () => {}

  const onClick = () => {}

  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Parameter onAdd={onAdd} />
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
