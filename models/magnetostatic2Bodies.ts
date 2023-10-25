/** @module Models.Magnetostatic */

import { IModel } from './index.d'

import description from './description/magnetostatic2Bodies'

const Contact2BodiesWeak: IModel = {
  category: 'Electromagntism',
  name: 'Magnetostatic',
  algorithm: 'magnetostatic',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Displacement (x)',
      value: 'Ux'
    },
    {
      label: 'Displacement (y)',
      value: 'Uy'
    },
    {
      label: 'Displacement (z)',
      value: 'Uz',
      only3D: true
    }
  ],
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometries',
      meshable: true,
      multiple: true,
      n: 2
    },
    materials: {
      index: 2,
      title: 'Materials',
      children: [
        {
          label: 'Density',
          name: 'Rho',
          htmlEntity: 'formula',
          default: 8050,
          units: [{ label: 'kg.m^{-3}' }],
          unit: { label: 'kg.m^{-3}' }
        },
        {
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: 1e6,
          units: [{ label: 'Pa' }],
          unit: { label: 'Pa' }
        },
        {
          label: "Poisson's ratio",
          name: 'Nu',
          htmlEntity: 'formula',
          default: 0.3
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      rightHandSide: {
        label: 'Right hand side',
        children: [
          {
            label: 'External force (x)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'N.m^{-3}' }],
            unit: { label: 'N.m^{-3}' }
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'N.m^{-3}' }],
            unit: { label: 'N.m^{-3}' }
          },
          {
            only3D: true,
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'N.m^{-3}' }],
            unit: { label: 'N.m^{-3}' }
          },
          {
            label: 'Gravitational acceleration (gx)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm.s^{-2}' }],
            unit: { label: 'm.s^{-2}' }
          },
          {
            label: 'Gravitational acceleration (gy)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm.s^{-2}' }],
            unit: { label: 'm.s^{-2}' }
          },
          {
            only3D: true,
            label: 'Gravitational acceleration (gz)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm.s^{-2}' }],
            unit: { label: 'm.s^{-2}' }
          }
        ]
      },
      FixedIterationNumber: {
        label: 'Contact fixed point',
        children: [
          {
            label: 'Maximal iterations number',
            htmlEntity: 'formula',
            default: 1
          }
        ]
      },
      friction: {
        label: 'Friction',
        children: [
          {
            label: 'Friction coefficent',
            htmlEntity: 'formula',
            default: 0
          },
          {
            label: 'Quasi-static steps number',
            htmlEntity: 'formula',
            default: 1
          }
        ]
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      fixed: {
        label: 'Fixed',
        refineFactor: 2
      },
      displacement: {
        label: 'Displacement',
        children: [
          {
            label: 'Ux',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm' }],
            unit: { label: 'm' }
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm' }],
            unit: { label: 'm' }
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'm' }],
            unit: { label: 'm' }
          }
        ],
        refineFactor: 2
      },
      pressure: {
        label: 'Surface force (normal)',
        children: [
          {
            label: 'd(U)/d(N)',
            htmlEntity: 'formula',
            default: 0,
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          }
        ],
        refineFactor: 2
      },
      componentsPresure: {
        label: 'Surface force (components)',
        children: [
          {
            label: 'x',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          },
          {
            label: 'y',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          },
          {
            label: 'z',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          }
        ]
      },
      contactArea: {
        label: 'Contact areas'
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        [
          {
            name: 'Body_1_-_Displacement',
            data: ['U1x', 'U1y', 'U1z'],
            data2D: ['U1x', 'U1y', '0']
          },
          {
            name: 'Body_1_-_vonMises',
            data: 'body1Sigma'
          },
          {
            name: 'Body_1_-_gamma11',
            data: 'body1Gamma11'
          },
          {
            name: 'Body_1_-_gamma12',
            data: 'body1Gamma12'
          },
          {
            name: 'Body_1_-_gamma13',
            data: 'body1Gamma13'
          },
          {
            name: 'Body_1_-_gamma22',
            data: 'body1Gamma22'
          },
          {
            name: 'Body_1_-_gamma23',
            data: 'body1Gamma23'
          },
          {
            name: 'Body_1_-_gamma33',
            data: 'body1Gamma33'
          }
        ],
        [
          {
            name: 'Body_2_-_Displacement',
            data: ['U2x', 'U2y', 'U2z'],
            data2D: ['U2x', 'U2y', '0']
          },
          {
            name: 'Body_2_-_vonMises',
            data: 'body2Sigma'
          },
          {
            name: 'Body_2_-_gamma11',
            data: 'body2Gamma11'
          },
          {
            name: 'Body_2_-_gamma12',
            data: 'body2Gamma12'
          },
          {
            name: 'Body_2_-_gamma13',
            data: 'body2Gamma13'
          },
          {
            name: 'Body_2_-_gamma22',
            data: 'body2Gamma22'
          },
          {
            name: 'Body_2_-_gamma23',
            data: 'body2Gamma23'
          },
          {
            name: 'Body_2_-_gamma33',
            data: 'body2Gamma33'
          }
        ]
      ],
      postprocessing: [
        {
          key: 'warpByVector',
          parameters: [{ key: 'Vectors', value: 'Displacement' }]
        },
        {
          key: 'contour',
          parameters: [
            {
              key: 'ContourBy',
              options: [
                'Displacement',
                'vonMises',
                'gamma11',
                'gamma12',
                'gamma13',
                'gamma22',
                'gamma23',
                'gamma33'
              ]
            }
          ]
        }
      ]
    }
  }
}

export default Contact2BodiesWeak
