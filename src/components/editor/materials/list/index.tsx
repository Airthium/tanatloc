import PropTypes from 'prop-types'
import { Card, Space, Typography } from 'antd'

import { IConfiguration } from '../..'

import MathJax from '@/components/assets/mathjax'
import { EditButton, DeleteButton } from '@/components/assets/button'

export interface IProps {
  materials: IConfiguration['materials']['children']
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

/**
 * List
 * @param props Props
 */
const List = ({ materials, onEdit, onDelete }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      {materials?.map((material, index) => (
        <Card
          key={material.name}
          size="small"
          title={material.name}
          actions={[
            <EditButton key="edit" onEdit={() => onEdit(index)} />,
            <DeleteButton key="delete" onDelete={async () => onDelete(index)} />
          ]}
        >
          <Space direction="vertical" style={{ maxWidth: '100%' }}>
            <Typography.Text>
              <span className="text-light">Symbol:</span> {material.symbol}
            </Typography.Text>
            <Typography.Text>
              <span className="text-light">Default value:</span>{' '}
              {material.default}
            </Typography.Text>
            <Typography.Text>
              <span className="text-light">Unit:</span>{' '}
              <MathJax.Inline text={material.unit} />
            </Typography.Text>
          </Space>
        </Card>
      ))}
    </>
  )
}

List.propTypes = {
  materials: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default List
