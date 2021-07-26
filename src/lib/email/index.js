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

const recover = (email) => {
  const recoveryLink = 'TODO build a recovery link'

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

  mailerSend.send(emailParams)
}

const Email = { subscribe, recover }
export default Email
