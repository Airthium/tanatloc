/** @module Components.Index2 */

import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Layout,
  Space,
  Steps,
  Typography
} from 'antd'

import Side from '@/components/assets/side'
import Footer from '../footer'
import { useRef } from 'react'
/**
 * Index
 * @returns Index
 */
const Index = (): JSX.Element => {
  /**
   * Render
   */

  const featuresRef = useRef()
  const developersRef = useRef()
  const caseStudyRef = useRef()
  const aboutUsRef = useRef()

  const scrollToView = (ref: any) => {
    ref?.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Layout className="Index">
      <Layout.Header className="Index-Header">
        <img src="/images/logo.svg" alt="Tanatloc" />

        <Button type="text" onClick={() => scrollToView(featuresRef)}>
          Features
        </Button>
        <Button type="text" onClick={() => scrollToView(developersRef)}>
          Developers
        </Button>
        <Button type="text" onClick={() => scrollToView(caseStudyRef)}>
          Case Studies
        </Button>
        <Button type="text" onClick={() => scrollToView(aboutUsRef)}>
          About us
        </Button>
        <Button type="primary">Get Started</Button>
      </Layout.Header>

      <Layout.Content className="Index-Content">
        <Space direction="vertical" size={90} className="full-width">
          <Side
            left={
              <>
                <Typography.Title>
                  Solve your toughest numerical simulation problems
                </Typography.Title>
                <Typography.Title level={4}>
                  Tanatloc is a multi-physics FEA software for engineers and
                  researchers. <br />
                  Use the provided models for the most common problems, make
                  your own, or partner with our experts to build one tailored to
                  your needs.
                </Typography.Title>
                <Button type="primary">Get Started</Button>
              </>
            }
            right={
              <img
                src="images/indexpage/modelisation-a-changer.png"
                alt="tanatloc"
              />
            }
            leftClassName="padding-50"
          />

          <Side
            left={
              <Typography.Title level={2}>
                The most common multi-physics models at your fingertips
              </Typography.Title>
            }
            right={
              <>
                <Checkbox checked={true}>Linear elasticity</Checkbox>
                <Checkbox checked={true}>Linear elasticity over time</Checkbox>
                <Checkbox checked={true}>Poisson</Checkbox>
                <Checkbox checked={true}>Stokes</Checkbox>
                <Checkbox checked={true}>Navier-Stokes over time</Checkbox>
                <Checkbox checked={true}>Termal diffusion</Checkbox>
              </>
            }
            className="background-primary "
            rightClassName="Index-models padding-50"
            leftClassName="padding-50"
            ref={featuresRef}
          />

          <Side
            left={
              <img
                src="images/indexpage/capture-a-changer.png"
                alt="tanatloc"
              />
            }
            right={
              <>
                <Typography.Title level={2}>
                  Solve your numerical problems locally or in the cloud, using
                  dedicated plugins
                </Typography.Title>
                <div className="Index-plugins">
                  <div>
                    <Avatar
                      size={64}
                      shape="square"
                      src="images/indexpage/logo-rescale.png"
                    />
                    <Typography.Title level={4}>Rescale</Typography.Title>
                    <Typography.Text className="text-light">
                      Paid feature
                    </Typography.Text>
                    <Button type="link">Contact us</Button>
                  </div>
                  <div>
                    <Avatar
                      size={64}
                      shape="square"
                      src="images/indexpage/logo-argo.png"
                    />
                    <Typography.Title level={4}>
                      Argo Graphics Sharetask
                    </Typography.Title>
                    <Typography.Text className="text-light">
                      Paid feature
                    </Typography.Text>
                    <Button type="link">Contact us</Button>
                  </div>
                  <div>
                    <Avatar
                      size={64}
                      shape="square"
                      src="images/indexpage/logo-slurm.png"
                    />
                    <Typography.Title level={4}>Slurm</Typography.Title>
                    <Typography.Text className="text-light">
                      Upcoming
                    </Typography.Text>
                  </div>
                  <div>
                    <Avatar
                      size={64}
                      shape="square"
                      src="images/indexpage/logo-qarnot.png"
                    />
                    <Typography.Title level={4}>
                      Qarnot Computing
                    </Typography.Title>
                    <Typography.Text className="text-light">
                      Upcoming
                    </Typography.Text>
                  </div>
                  <div>
                    <Avatar size={64} shape="square" src="" />
                    <Typography.Title level={4}>
                      Your own plugin
                    </Typography.Title>
                    <Typography.Text className="text-light">
                      Paid feature
                    </Typography.Text>
                  </div>
                </div>
              </>
            }
            rightClassName="padding-50"
            ref={developersRef}
          />

          <Side
            left={
              <>
                <Typography.Title level={2}>Case Study</Typography.Title>
                <Typography.Title level={3}>DENSO</Typography.Title>
                <Typography.Text>
                  DENSO is a leading automotive and Fortune 500 company. Hiroshi
                  Ogawa, at Denso’s Heat Exchanger Development Department,
                  implemented a custom FreeFEM model on TANATLOC with the help
                  of Professor Atsushi Suzuki from Osaka University.
                </Typography.Text>
                <Typography.Text>
                  Denso’s Solder Filling model was added to TANATLOC, and the
                  calculations are deployed seamlessly on the cloud or on
                  on-premise via the Argo Sharetask plug-in.
                </Typography.Text>
                <Button type="primary">See more of Tanatloc</Button>
              </>
            }
            right={
              <img src="images/indexpage/denso-a-changer.png" alt="tanatloc" />
            }
            className="Index-casestudy"
            rightClassName="Index-casestudy-right"
            ref={caseStudyRef}
          />

          <Card
            bordered={false}
            title="Tanatloc is an FEA software based on FreeFEM, an extremely
                powerful and versatile open-source PDE solver. It runs locally
                using an electron build."
          >
            <Typography.Title level={3} className="text-light">
              Follow these steps to get started:
            </Typography.Title>
            <Steps direction="vertical">
              <Steps.Step
                title="Install PostgreSQL"
                description="Follow the PostgreSQL installation instruction at:
                      postgresql.org/download/"
              />
              <Steps.Step
                title="Tanatloc/worker docker"
                description="Pull the latest tanatloc/worker docker with the command
                line: docker pull tanatloc/worker"
              />
              <Steps.Step
                title="Download the latest app"
                description="Pull the latest tanatloc/worker docker with the command
                line: docker pull tanatloc/worker"
              />
              <Steps.Step
                title=""
                description="Download the latest app for Linux, MacOS or Windows."
              />
            </Steps>
          </Card>

          <Side
            left={
              <img
                src="images/indexpage/TanatlocByAirthium.png"
                alt="airthium"
              />
            }
            right={
              <>
                <Typography.Text>
                  TANATLOC is maintained by Airthium, a US/France based deeptech
                  startup. We build a very robust and highly efficient electric
                  heat engine to decarbonise the planet.
                </Typography.Text>
                <Button type="primary">Discover the project</Button>
              </>
            }
            top={
              <Side
                left={
                  <img
                    src="images/indexpage/airthium-a-changer.png"
                    alt="airthium"
                  />
                }
                right={
                  <>
                    <Typography.Title level={2}>
                      Support our fight against climate change
                    </Typography.Title>
                    <Button>Invest in our crowdfounding</Button>
                  </>
                }
                className="background-primary"
                rightClassName="padding-50"
              />
            }
            className="Index-about"
            leftClassName="padding-50"
            rightClassName="padding-50"
            ref={aboutUsRef}
          />

          <Footer />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Index
