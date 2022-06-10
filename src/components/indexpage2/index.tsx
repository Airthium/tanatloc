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
      <Layout.Header className="display-flex-between bg-white Index2-header">
        <img src="/images/logo.svg" alt="Tanatloc" className="Index2-logo" />
        <div className="display-flex-between width-60 Index2-navigation">
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
        backgroundColor: 'white',
        overflow: 'auto',
        overflowX: 'hidden'
      }}
        className="bg-white Index2-content"
      >
        <div className="Index2-cols">
          <div className="Index2-row Index2-row-content">
            <h1>
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
        <div className="display-flex-around bg-tanatloc-primary width-80 margin-element Index2-models">
          <div className='width-30'>
            <h2>The most common multi-physics models at your fingertips</h2>
          </div>
          <div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">Linear Elasticity</h4>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">
                Linear Elasticity over time
              </h4>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">Poisson</h4>
            </div>
          </div>
          <div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">Stokes</h4>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">Navier-Stokes over time</h4>
            </div>
            <div className="Index2-models-content">
              <CheckSquareOutlined className="Index2-models-icons" />
              <h4 className="Index2-models-text">Thermal diffusion</h4>
            </div>
          </div>
        </div>
        <div className="display-flex-between margin-element Index2-plugins">
          <div className='width-50'>
            <img
              src="images/indexpage/capture-a-changer.png"
              alt="tanatloc"
            />
          </div>

          <div className='width-40'>
            <h2>
              Solve your numerical problems locally or in the cloud, using
              dedicated plugins{' '}
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row'
              }}
            >
              <div className='text-center width-30'>
                <img
                  src="images/indexpage/logo-rescale.png"
                  alt="rescale"
                />
                <h3>Rescale</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div className='text-center width-30'>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-slurm.png"
                  alt="slurm"
                />
                <h3>Slurm</h3>
                <h5>Upcoming</h5>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-qarnot.png"
                  alt="qarnot"
                />
                <h3>Quarnot Computing</h3>
                <h5>Upcoming</h5>
              </div>
              <div style={{ textAlign: 'center', width: '30%' }}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                />
                <h3>Your plugin</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-element Index2-casestudy">
          <div className="display-flex-evenly width-50 Index2-casestudy-content">
            <div>
              <h2>Case Study</h2>
              <h3>DENSO</h3>
            </div>
            <Typography>
              DENSO is a leading automotive and Fortune 500 company. Hiroshi
              Ogawa, at Denso’s Heat Exchanger Development Department,
              implemented a custom FreeFEM model on TANATLOC with the help of
              Professor Atsushi Suzuki from Osaka University. Denso’s Solder
              Filling model was added to TANATLOC, and the calculations are
              deployed seamlessly on the cloud or on on-premise via the Argo
              Sharetask plug-in.
            </Typography>
            <Button className="get-started">See more of Tanatloc</Button>
          </div>
          <div className="width-50">
            <img
              src="images/indexpage/denso-a-changer.png"
              className="Index2-casestudy-img"
              alt="tanatloc"
            />
          </div>
        </div>
        <div className="margin-element width-60">
          <div className="width-50">
            <h2>
              Tanatloc is an FEA software based on FreeFEM, an extremely
              powerful and versatile open-source PDE solver. It runs locally
              using an electron build.
            </h2>
            <h3 style={{ color: 'gray' }}>
              Follow these steps to get started :
            </h3>
          </div>
          <div className="Index2-step-body-container">
            <div className="Index2-step-side-container">
              <div className="display-flex-between Index2-step-container">
                <img src="images/indexpage/List1.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Install PostgreSQL</h2>
                  <Typography>
                    Follow the PostgreSQL installation instruction at:
                    postgresql.org/download/
                  </Typography>
                </div>
              </div>
              <div className="display-flex-between Index2-step-container">
                <img src="images/indexpage/List3.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Tanatloc/worker docker</h2>
                  <Typography>
                    Pull the latest tanatloc/worker docker with the command line
                    : docker pull tanatloc/worker
                  </Typography>
                </div>
              </div>
            </div>
            <div className="Index2-step-side-container">
              <div className="display-flex-between Index2-step-container">
                <img src="images/indexpage/List2.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Install Docker</h2>
                  <Typography>
                    Follow the Docker installation instruction at :
                    docs.docker.com/get-docker/
                  </Typography>
                </div>
              </div>
              <div className="display-flex-between Index2-step-container">
                <img src="images/indexpage/List4.png" alt="first step" />
                <div className="Index2-step-explanations">
                  <h2>Download the latest app</h2>
                  <Typography>
                    Download the latest app for Linux, MacOS or Windows. The
                    default login is email : “admin” password : “password”
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Index2-aboutus">
          <div className="display-flex-evenly width-80 margin-element">
            <img
              src="images/indexpage/AirthiumByTanatloc.png"
              className="Index2-aboutus-tanatloc-container-logo"
              alt="airthium"
            />
            <div className="width-50 display-flex-around Index2-aboutus-tanatloc-infos">
              <Typography>
                TANATLOC is maintained by Airthium, a US/France based deeptech
                startup. We build a very robust and highly efficient electric
                heat engine to decarbonise the planet.
              </Typography>
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
              <h2>Support our fight against climate change</h2>
              <Button style={{ width: '80%', margin: 'auto' }}>
                Invest in our crowdfounding
              </Button>
            </div>
          </div>
        </div>
        <div className="Index2-footer">
          <div className="Index2-footer-infos">
            <div style={{ width: '30%' }}>
              <h3>Thanks</h3>
              <Typography>
                We would like to thank : <br /> - Professor Fréderic Hecht, Dr.
                Pierre Jolivet, and the FreeFEM’s contributors <br /> -
                Professor Christophe Geuzaine, Professor Jean-François Remacle
                and the GMSH contributors <br /> - The Open Cascade development
                team <br />
                <br /> Without you this software would not have been possible.
              </Typography>
            </div>
            <div>
              <h3>Navigate</h3>
              <Typography>
                Logo features <br /> Developers <br /> Case Studies <br /> Get
                Started <br /> About Us
              </Typography>
            </div>
            <div style={{ width: '30%' }}>
              <h3>Contact</h3>
              <Typography>
                <b>contact@airthium.com </b> for commercial inquiries{' '}
              </Typography>
              <Typography>
                <b>Github Issues </b>
                for support questions
              </Typography>
            </div>
          </div>
          <Divider style={{ borderTop: '1px solid black' }} />
          <div className="Index2-footer-infos">
            <img
              src="/images/logo.svg"
              alt="Tanatloc"
              className="Index2-logo"
            />
            <Typography>
              Copyright ©{new Date().getFullYear()} - All rights reserved |
              Design by enora-dvvr.fr
            </Typography>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}
