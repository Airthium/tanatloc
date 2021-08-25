import rescale from '@/updaters/rescale'

const update = async () => {
  console.info('Start update...')

  await rescale()

  console.info('Update finished.')
}

export default update
