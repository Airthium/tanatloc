import WaitDB from '@/database/wait'

const add = async ({ email }) => {
  WaitDB.add({ email })
}

export default { add }
