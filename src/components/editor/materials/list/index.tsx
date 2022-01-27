import { Button, Card, Space, Typography } from 'antd'

import { IConfiguration } from '../..'

import MathJax from '@/components/assets/mathjax'
import { EditButton, DeleteButton } from '@/components/assets/button'

export interface IProps {
  materials: IConfiguration['materials']['children']
}

const List = ({ materials }: IProps): JSX.Element => {
  const onEdit = (material, index) => {}

  const onDelete = async (index) => {}

  return (
    <>
      {materials?.map((material, index) => (
        <Card
          key={material.name}
          size="small"
          title={material.name}
          actions={[
            <EditButton key="edit" onEdit={() => onEdit(material, index)} />,
            <DeleteButton key="delete" onDelete={() => onDelete(index)} />
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

export default List
