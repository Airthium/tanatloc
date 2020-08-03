import call from './call'

export default async () => {
  await call('/api/logout')
}
