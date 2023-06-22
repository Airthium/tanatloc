/** @module Models.ThermicDiffusion */

import { IModel } from './index.d'

import description from './description/thermicDiffusion'

/**
 * Thermic diffusion
 */
const ThermicDiffusion: IModel = {
  category: 'Thermic',
  name: 'Thermal diffusion',
  algorithm: 'thermicDiffusion',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometry',
      meshable: true
    },
    materials: {
      index: 2,
      title: 'Materials',
      children: [
        {
          label: 'Density',
          name: 'Rho',
          htmlEntity: 'formula',
          default: '7960',
          units: [
            { label: 'kg.m^{-3}' },
            { label: 'g.mm^{-3}', multiplicator: 1e6 }
          ],
          unit: { label: 'kg.m^{-3}' }
        },
        {
          label: 'Thermal conductivity',
          name: 'Lambda',
          htmlEntity: 'formula',
          default: '15',
          units: [{ label: 'W.m^{-1}.K^{-1}' }],
          unit: { label: 'W.m^{-1}.K^{-1}' }
        },
        {
          label: 'Heat capacity',
          name: 'Cp',
          htmlEntity: 'formula',
          default: '502',
          units: [{ label: 'J.K^{-1}.kg^{-1}' }],
          unit: { label: 'J.K^{-1}.kg^{-1}' }
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      time: {
        label: 'Time',
        children: [
          {
            label: 'Total time',
            htmlEntity: 'formula',
            default: '1',
            units: [{ label: 's' }],
            unit: { label: 's' }
          },
          {
            label: 'Time step',
            htmlEntity: 'formula',
            default: '0.1',
            units: [{ label: 's' }],
            unit: { label: 's' }
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: 'T',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1'
              },
              {
                label: 'P2',
                value: 'P2'
              }
            ],
            default: 'P1'
          }
        ]
      },
      solver: {
        advanced: true,
        label: 'Solver',
        children: [
          {
            label: 'System resolution',
            htmlEntity: 'select',
            options: [
              { label: 'GMRES', value: 'GMRES' },
              { label: 'MUMPS', value: 'MUMPS' },
              { label: 'UMFPACK', value: 'UMFPACK' }
            ],
            default: 'MUMPS'
          }
        ]
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      temperature: {
        label: 'Temperature',
        children: [
          {
            label: 'T',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'K' }, { label: 'C', adder: -273.15 }],
            unit: { label: 'K' }
          }
        ],
        refineFactor: 2
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        [
          {
            name: 'T',
            data: 'T',
            units: [{ label: 'K' }, { label: 'C', adder: -273.15 }],
            unit: { label: 'K' }
          }
        ]
      ],
      resultsFilter: {
        name: 'Time',
        prefixPattern: 'Result_',
        suffixPattern: '.vtu',
        pattern: 'Result_\\d+.vtu',
        multiplicator: ['parameters', 'time', 'children', '1']
      }
    }
  }
}

export default ThermicDiffusion
