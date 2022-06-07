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
          <div style={{width:'50%'}}>
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
            <div style={{display:'flex', flexWrap:'wrap', flexDirection:'row'}}>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
              <div style={{textAlign:'center', width: '30%'}}>
                <img
                  src="images/indexpage/logo-argo.png"
                  alt="argo"
                  className="Index2-plugins-logo"
                />
                <h3>Argo-graph sharetask</h3>
                <h5>Paid Feature</h5>
                <h6>Contact us</h6>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
      <Layout.Footer style={{ background: 'none' }}></Layout.Footer>
    </Layout>
  )
}
