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
        label: 'Vectors'
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
  }
]

export default postprocessing
