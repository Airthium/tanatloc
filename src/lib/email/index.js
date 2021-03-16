/** @module lib/email */

import MailerSend, { Recipient, EmailParams } from 'mailersend'

import { TOKEN } from '@/config/email'

const mailerSend = new MailerSend({
  api_key: TOKEN
})

/**
 * Subscribe
 * @param {string} email Email
 * @param {string} id User id
 */
const subscribe = (email, id) => {
  const recipients = [new Recipient(email)]
  const emailParams = new EmailParams()
    .setFrom('subscribe@tanatloc.com')
    .setFromName('Tanatloc')
    .setRecipients(recipients)
    .setSubject('Tanatloc subscription')
    .setHtml('test')
  mailerSend.send(emailParams)
}

export default { subscribe }
