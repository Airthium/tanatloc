export interface IPostProcessing {
  label: string
  parameters?: {
    label: string
    type: string
  }[]
}

const postprocessing: IPostProcessing[] = [
  {
    label: 'Warp by vector',
    parameters: [
      {
        label: 'Scale factor',
        type: 'number'
      }
    ]
  }
]

export default postprocessing
