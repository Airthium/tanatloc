import PropTypes from 'prop-types'
import { Card, List, Space, Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import { DeleteButton, EditButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

export interface IProps {
  initializations: IConfiguration['initializations']
  onEdit: (key: string) => void
  onDelete: (key: string) => void
}

/**
 * List
 * @param props Props
 */
const InitializationsList = ({
  initializations,
  onEdit,
  onDelete
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      {initializations &&
        Object.keys(initializations).map((key) => {
          const initialization = initializations[key]
          return (
            <Card
              key={key}
              size="small"
              title={initialization.name}
              actions={[
                <EditButton key="edit" onEdit={() => onEdit(key)} />,
                <DeleteButton
                  key="delete"
                  onDelete={async () => onDelete(key)}
                />
              ]}
            >
              {initialization.children && (
                <List>
                  {initialization.children.map((child) => (
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
              {initialization.compatibility && (
                <List>
                  {initialization.compatibility.map((compatibility) => (
                    <List.Item key={compatibility.algorithm}>
                      <Space direction="vertical" style={{ maxWidth: '100%' }}>
                        <Typography.Text>
                          <span className="text-light">Algorithm:</span>{' '}
                          {compatibility.algorithm}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">Filter name:</span>{' '}
                          {compatibility.filter.name}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">
                            Filter prefix pattern:
                          </span>{' '}
                          {compatibility.filter.prefixPattern}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">
                            Filter suffix pattern:
                          </span>{' '}
                          {compatibility.filter.suffixPattern}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">Filter pattern:</span>{' '}
                          {compatibility.filter.pattern}
                        </Typography.Text>
                        <Typography.Text>
                          <span className="text-light">
                            Filter multiplicator:
                          </span>{' '}
                          {compatibility.filter.multiplicator?.join('.')}
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

InitializationsList.propTypes = {
  initializations: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}

export default InitializationsList
