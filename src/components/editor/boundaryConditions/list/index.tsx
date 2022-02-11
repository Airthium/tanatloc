import PropTypes from 'prop-types'

import { IConfiguration } from '../..'

import MathJax from '@/components/assets/mathjax'
import { EditButton, DeleteButton } from '@/components/assets/button'
import { Card, List, Space, Typography } from 'antd'

export interface IProps {
  boundaryConditions: IConfiguration['boundaryConditions']
  onEdit: (key: string) => void
  onDelete: (key: string) => void
}

const BoundaryConditionsList = ({
  boundaryConditions,
  onEdit,
  onDelete
}: IProps): JSX.Element => {
  return (
    <>
      {boundaryConditions &&
        Object.keys(boundaryConditions).map((key) => {
          const boundaryCondition = boundaryConditions[key]
          return (
            <Card
              key={key}
              size="small"
              title={boundaryCondition.name}
              actions={[
                <EditButton key="edit" onEdit={() => onEdit(key)} />,
                <DeleteButton
                  key="delete"
                  onDelete={async () => onDelete(key)}
                />
              ]}
            >
              {boundaryCondition.refineFactor && (
                <Typography.Text>
                  <span className="text-light">Refine factor:</span>{' '}
                  {boundaryCondition.refineFactor}
                </Typography.Text>
              )}
              {boundaryCondition.children && (
                <List>
                  {boundaryCondition.children.map((child) => (
                    <List.Item key={child.name}>
                      <Space direction="vertical" style={{ maxWidth: '100%' }}>
                        <Typography.Text>
                          <span className="text-light">Name:</span> {child.name}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">Default:</span>{' '}
                          {child.default}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">Unit:</span>{' '}
                          <MathJax.Inline text={child.unit} />
                        </Typography.Text>
                      </Space>
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
          )
        })}
    </>
  )
}

BoundaryConditionsList.propTypes = {
  boundaryConditions: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}

export default BoundaryConditionsList