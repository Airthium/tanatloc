import { Button, Layout, Tooltip } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'
import PostprocessingAPI from '@/api/postprocessing'

export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id'>
  result?: Pick<IFrontResult, 'fileName' | 'originPath'>
}

const run = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  result: Pick<IFrontResult, 'fileName' | 'originPath'>,
  filter: string,
  ...parameters: string[]
): Promise<void> => {
  try {
    await PostprocessingAPI.run(simulation, result, filter, ...parameters)
  } catch (err) {
    ErrorNotification('postprocessing', err)
  }
}

const Postprocessing = ({ simulation, result }: IProps): JSX.Element | null => {
  if (!simulation || !result) return null
  return (
    <Layout
      style={{ position: 'absolute', zIndex: 150, right: 0, bottom: 150 }}
    >
      <Layout.Content>
        <Tooltip title="Data visualization">
          <Button
            type="primary"
            onClick={async () =>
              run(simulation, result, 'warpByVector', 'U', '1')
            }
            style={{
              width: 80,
              height: 80,
              border: '1ps solid gray',
              borderRadius: 40,
              marginBottom: -40
            }}
          >
            POSTPROCESSING
          </Button>
        </Tooltip>
      </Layout.Content>
    </Layout>
  )
}

export default Postprocessing
