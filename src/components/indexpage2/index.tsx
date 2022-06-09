/** @module Components.Index2 */

import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Card, Divider, Layout, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  LoginOutlined,
  TeamOutlined,
  CheckSquareOutlined
} from '@ant-design/icons'

import packageJson from '../../../package.json'

import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import Utils from '@/lib/utils'

import UserAPI from '@/api/user'
import { Row, Col } from 'antd'
import { Avatar, List } from 'antd'

export default function Index2() {
  return (
    <Layout className="Index2">
      <Layout.Header className="Index2-header">
        <img src="/images/logo.svg" alt="Tanatloc" className="Index2-logo" />
        <div className="Index2-navigation">
          <Button className="no-border" size="small">
            Features
          </Button>
          <Button className="no-border" size="small">
            Developers
          </Button>
          <Button className="no-border" size="small">
            Case Studies
          </Button>
          <Button className="no-border" size="small">
            About us
          </Button>
          <Button className="no-border get-started" size="small">
            Get Started
          </Button>
        </div>
      </Layout.Header>
      <Divider />
      <Layout.Content
        style={{
          margin: '0 10px',
          padding: '20px',
          backgroundColor: 'white',
          overflow: 'auto'
        }}
        className="Index2-content"
      >
        <div className="Index2-cols">
          <div className="Index2-row Index2-row-content">
            <h1 className="Index2-title1">
              Solve your toughest numerical simulation problems
            </h1>
            <h4>
              Tanatloc is a multi-physics FEA software for engineers and
              researchers. <br />
              Use the provided models for the most common problems, make your
              own, or partner with our experts to build one tailored to your
              needs.
            </h4>
            <Button className="no-border get-started" size="small">
              Get Started
            </Button>
          </div>
          <div className="Index2-row">
            <img
              src="images/indexpage/modelisation-a-changer.png"
              className="Index2-modelisation"
              alt="tanatloc"
            />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Divider />
        <div className="Index2-models">
          <div style={{ width: '30%' }}>
            <h2>
              <b>The most common multi-physics models at your fingertips</b>
            </h2>
          </div>
          <div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Linear Elasticity</p>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Linear Elasticity over time</p>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Poisson</p>
            </div>
          </div>
          <div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Stokes</p>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Navier-Stokes over time</p>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <p className="Index2-models-text">Thermal diffusion</p>
            </div>
          </div>
        </div>
        <Divider />
        <div className="Index2-plugins">
          <div style={{ width: '50%' }}>
            <img
              src="images/indexpage/capture-a-changer.png"
              className="Index2-plugins-img"
              alt="tanatloc"
            />
          </div>

          <div>
            <h1>
              Solve your numerical problems locally or in the cloud, using
              dedicated plugins{' '}
            </h1>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row'
              }}
            >
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-rescale.png"
                  alt="rescale"
                  className="Index2-plugins-logo"
                />
                <h3>Rescale</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-slurm.png"
                  alt="slurm"
                  className="Index2-plugins-logo"
                />
                <h3>Slurm</h3>
                <h5>Upcoming</h5>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-qarnot.png"
                  alt="qarnot"
                  className="Index2-plugins-logo"
                />
                <h3>Quarnot Computing</h3>
                <h5>Upcoming</h5>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Your plugin</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="Index2-casestudy">
          <div className="Index2-casestudy-content">
            <h2>Case Study</h2>
            <h4>DENSO</h4>
            <p>
              DENSO is a leading automotive and Fortune 500 company. Hiroshi
              Ogawa, at Denso’s Heat Exchanger Development Department,
              implemented a custom FreeFEM model on TANATLOC with the help of
              Professor Atsushi Suzuki from Osaka University. Denso’s Solder
              Filling model was added to TANATLOC, and the calculations are
              deployed seamlessly on the cloud or on on-premise via the Argo
              Sharetask plug-in.
            </p>
            <Button className="get-started">See more of Tanatloc</Button>
          </div>
          <div className="Index2-casestudy-img-container">
            <img
              src="images/indexpage/denso-a-changer.png"
              className="Index2-casestudy-img"
              alt="tanatloc"
            />
          </div>
        </div>
        <div className="Index2-step-main-cointainer">
          <div className="Index2-step-header">
            <h1>
              Tanatloc is an FEA software based on FreeFEM, an extremely
              powerful and versatile open-source PDE solver. It runs locally
              using an electron build.
            </h1>
            <h3>Follow these steps to get started :</h3>
          </div>
          <div className="Index2-step-body-container">
            <div className="Index2-step-side-container">
              <div className="Index2-step-container">
                <img src="images/indexpage/List1.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Install PostgreSQL</h2>
                  <p>
                    Follow the PostgreSQL installation instruction at:
                    postgresql.org/download/
                  </p>
                </div>
              </div>
              <div className="Index2-step-container">
                <img src="images/indexpage/List3.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Tanatloc/worker docker</h2>
                  <p>
                    Pull the latest tanatloc/worker docker with the command line
                    : docker pull tanatloc/worker
                  </p>
                </div>
              </div>
            </div>
            <div className="Index2-step-side-container">
              <div className="Index2-step-container">
                <img src="images/indexpage/List2.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Install Docker</h2>
                  <p>
                    Follow the Docker installation instruction at :
                    docs.docker.com/get-docker/
                  </p>
                </div>
              </div>
              <div className="Index2-step-container">
                <img src="images/indexpage/List4.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Download the latest app</h2>
                  <p>
                    Download the latest app for Linux, MacOS or Windows. The
                    default login is email : “admin” password : “password”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Index2-aboutus">
          <div className="Index2-aboutus-tanatloc-container">
            <img
              src="images/indexpage/AirthiumByTanatloc.png"
              className="Index2-aboutus-tanatloc-container-logo"
              alt="airthium"
            />
            <div className="Index2-aboutus-tanatloc-infos">
              <p>
                TANATLOC is maintained by Airthium, a US/France based deeptech
                startup. We build a very robust and highly efficient electric
                heat engine to decarbonise the planet.
              </p>
              <h4>Discover the project</h4>
            </div>
          </div>
          <div className="Index2-aboutus-crowdfunding-container">
            <img
              src="images/indexpage/airthium-a-changer.png"
              className="Index2-aboutus-crowdfunding-logo"
              alt="airthium"
            />
            <div className="Index2-aboutus-crowdfunding">
              <h1>Support our fight against climate change</h1>
              <Button style={{ width: '80%', margin: 'auto' }}>
                Invest in our crowdfounding
              </Button>
            </div>
          </div>
        </div>
        <div className='Index2-last'>
        <div>
          <div>
            <h2>Thanks</h2>
            <p>
              We would like to thank : - Professor Fréderic Hecht, Dr. Pierre
              Jolivet, and the FreeFEM’s contributors - Professor Christophe
              Geuzaine, Professor Jean-François Remacle and the GMSH
              contributors - The Open Cascade development team Without you this
              software would not have been possible.
            </p>
          </div>
          <div>
            <h2>Navigate</h2>
            <p>Logo Features Developers Case Studies Get Started About Us</p>
          </div>
          <div>
            <h1>Contact</h1>
            <p>
              <b>contact@airthium.com </b> for commercial inquiries{' '}
            </p>
            <p>
              <b>Github Issues </b>
              for support questions
            </p>
          </div>
        </div>
        <Divider />
        <div>
        <img src="/images/logo.svg" alt="Tanatloc" className="Index2-logo" />
        <p>Copyright ©2022 - All rights reserved | Design by enora-dvvr.fr</p>
        </div>
      </div>
      </Layout.Content>
      
    </Layout>
  )
}
