import {Card, Collapse} from 'antd'

/**
 * HPC plugins documentation
 */
const HPC = () => {
    return (
    <Card title="HPC plugins">
        <Collapse>
        <Collapse.Panel header="Local plugin">
        <p>Allow to compute a simulation directly on the frontal server.</p>
        <p>This plugin is only reserved for test purposes.</p>
        </Collapse.Panel>
    
        <Collapse.Panel header="Rescale plugin">
        <p>Allow to compute a simulation on <a href="https://www.rescale.com/">Rescale</a>.</p>
        <p>
            You have to fill the following informations:
            <ul>
                <li>Name: a name to retrieve your configuration during the simulation parameterization;</li>
                <li>Token: your API token. You can find it in your <a href="https://platform.rescale.jp/user/settings/api-key/">Rescale account</a>;</li>
                <li>Platform: the platform you use. USA, Europe or Japan;</li>
                <li>[Optional] Organization name: the organization you ar in;</li>
                <li>[Optional] Additional files: additional files you have to use with your simulations. Generally FreeFEM custom plugins.</li>
            </ul>
        </p>
        <p>
            When you save this informations, Tanatloc will check your API key, the available core types, and the available FreeFEM versions.
        </p>
        </Collapse.Panel>
        </Collapse>
    </Card>
    )
}

export default HPC