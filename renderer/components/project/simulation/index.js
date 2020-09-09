import { useState, useEffect } from 'react'
import { Drawer, Steps } from 'antd'

const Simulation = ({ simulation }) => {
  // State
  const [visible, setVisible] = useState()

  useEffect(() => {
    if (simulation) setVisible(true)
    else setVisible(false)
  }, [simulation])

  return (
    <Drawer
      visible={visible}
      onClose={() => setVisible(false)}
      mask={false}
      maskClosable={false}
      placement="top"
    >
      <Steps>
        <Steps.Step
          title="Geometry"
          description="Import your geometry or mesh"
        />
        <Steps.Step
          title="Parameters"
          description="Parameterize your simulation"
        />
        <Steps.Step title="Run" description="Run your simulation" />
        <Steps.Step title="Results" description="Visualize your results" />
      </Steps>
    </Drawer>
  )
}

export default Simulation
