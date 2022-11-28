/** @module Components.Help.Doc.Hpc */

import { Card, Typography } from 'antd'

/**
 * HPC plugins documentation
 * @returns HPC
 */
const HPC = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card title="Account / HPC plugins">
      <Typography.Title level={5}>Local plugin</Typography.Title>
      <Typography.Text>
        Allow to compute a simulation directly on the frontal server.
      </Typography.Text>
      <Typography.Text>
        This plugin is only reserved for test purposes.
      </Typography.Text>

      <Typography.Title level={5}>Rescale plugin</Typography.Title>
      <Typography.Text>
        Allow to compute a simulation on{' '}
        <a href="https://www.rescale.com/">Rescale</a>.
      </Typography.Text>
      <Typography.Text>
        You have to fill the following informations:
      </Typography.Text>
      <ul>
        <li>
          Name: a name to retrieve your configuration during the simulation
          parameterization;
        </li>
        <li>
          Token: your API token. You can find it in your{' '}
          <a href="https://platform.rescale.jp/user/settings/api-key/">
            Rescale account
          </a>
          ;
        </li>
        <li>Platform: the platform you use. USA, Europe or Japan;</li>
        <li>[Optional] Organization name: the organization you are in;</li>
        <li>[Optional] Project id: the financial project identifier;</li>
        <li>
          [Optional] Default walltime: the default value for the run walltime;
        </li>
        <li>
          [Optional] Additional files: additional files you have to use with
          your simulations. Generally FreeFEM custom plugins.
        </li>
      </ul>
      <Typography.Text>
        When you save this informations, Tanatloc will check your API key, the
        available core types, and the available FreeFEM versions.
      </Typography.Text>
    </Card>
  )
}

export default HPC
