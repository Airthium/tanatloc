/** @module Postprocessing */

export interface IPostProcessing {
  key: string
  label: string
  parameters?: {
    key: string
    label: string
    default?: string
    rules?: {
      required?: boolean
      message?: string
    }[]
  }[]
}

const postprocessing: IPostProcessing[] = [
  {
    key: 'warpByVector',
    label: 'Warp by vector',
    parameters: [
      {
        key: 'Vectors',
        label: 'Vectors',
        rules: [
          {
            required: true,
            message: 'Vectors is required'
          }
        ]
      },
      {
        key: 'ScaleFactor',
        label: 'Scale factor',
        default: '1',
        rules: [
          {
            required: true,
            message: 'Scale factor is required'
          }
        ]
      }
    ]
  },
  {
    key: 'contour',
    label: 'Contour',
    parameters: [
      {
        key: 'ContourBy',
        label: 'Contour by',
        rules: [
          {
            required: true,
            message: 'ContourBy by is required'
          }
        ]
      },
      {
        key: 'isosurface',
        label: 'Isosurface',
        default: '0',
        rules: [
          {
            required: true,
            message: 'Isosurface is required'
          }
        ]
      }
    ]
  }
]

export default postprocessing
