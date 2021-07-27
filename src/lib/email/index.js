/** @module lib/email */

import MailerSend, { Recipient, EmailParams } from 'mailersend'

import { DOMAIN } from '@/config/domain'
import { TOKEN, PASSWORD_RECOVERY } from '@/config/email'

import Link from '../link'

const mailerSend = new MailerSend({
  api_key: TOKEN
})

const send = async (email) => {
  const res = await mailerSend.send(email)
  if (res.status !== 202) throw new Error(res.statusText)
}

/**
 * Subscribe
 * @param {string} email Email
 * @param {string} id User id
 */
const subscribe = async (email, id) => {
  // Create link
  const link = await Link.add({ type: subscribe, email, userid: id })

  const subscribeLink = DOMAIN + '/validate?id=' + link.id

  const recipients = [new Recipient(email)]
  const personalization = [
    {
      email,
      data: {
        subscribeLink
      }
    }
  ]

  const emailParams = new EmailParams()
    .setFrom('noreply@tanatloc.com')
    .setFromName('Tanatloc')
    .setRecipients(recipients)
    .setSubject('Tanatloc subscription')
    .setTemplateId('3vz9dle2p6lkj50y')
    .setPersonalization(personalization)

  await send(emailParams)
}

const recover = async (email) => {
  // Create link entry
  const link = await Link.add({ type: PASSWORD_RECOVERY, email })

  const recoveryLink = DOMAIN + '/password?id=' + link.id

  const recipients = [new Recipient(email)]
  const personalization = [
    {
      email,
      data: {
        recoveryLink
      }
    }
  ]
  const emailParams = new EmailParams()
    .setFrom('noreply@tanatloc.com')
    .setFromName('Tanatloc')
    .setRecipients(recipients)
    .setSubject('Recover your password')
    .setTemplateId('vywj2lp7n1l7oqzd')
    .setPersonalization(personalization)

  await send(emailParams)
}

const Email = { subscribe, recover }
export default Email
