import rescale from '@/updaters/rescale'

/**
 * Update
 * @memberof Install
 */
const update = async () => {
  console.info('Start update...')

  await rescale()
}

update()
  .then(() => console.info('Update finished.'))
  .catch((err) => console.error(err))
