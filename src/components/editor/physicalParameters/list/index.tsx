import PropTypes from 'prop-types'
import { Card, List, Space, Typography } from 'antd'

import { IConfiguration } from '../..'

import MathJax from '@/components/assets/mathjax'
import { EditButton, DeleteButton } from '@/components/assets/button'

export interface IProps {
  parameters: IConfiguration['parameters']['key']
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

/**
 * List
 * @param props Props
 */
const ParametersList = ({
  parameters,
  onEdit,
  onDelete
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      {parameters &&
        Object.keys(parameters).map((key, index) => {
          const parameter: IConfiguration['parameters']['key'] = parameters[key]
          return (
            <Card
              key={index}
              size="small"
              title={parameter.name}
              actions={[
                <EditButton key="edit" onEdit={() => onEdit(index)} />,
                <DeleteButton
                  key="delete"
                  onDelete={async () => onDelete(index)}
                />
              ]}
            >
              <List>
                {parameter.children.map((child) => (
                  <List.Item>
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
            </Card>
          )
        })}
    </>
  )
}

ParametersList.propTypes = {
  parameters: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ParametersList
