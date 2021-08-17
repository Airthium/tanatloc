import route from '@/route/groups'

describe('e2e/backend/groups', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (code) => {
      resStatus = code
      return {
        json: (object) => {
          resJson = object
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  test('empty', async () => {
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ groups: [] })
  })
})
