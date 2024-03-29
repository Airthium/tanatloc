/** @module Lib.Email */

import { MailerSend, Recipient, EmailParams, Sender } from 'mailersend'

import { DOMAIN } from '@/config/domain'
import { TOKEN, SUBSCRIBE, PASSWORD_RECOVERY, REVALIDATE } from '@/config/email'

import Link from '../link'
import User from '../user'

const mailerSend = new MailerSend({
  apiKey: TOKEN
})

/**
 * Send
 * @param email Email
 * @returns Valid
 */
const send = async (email: EmailParams): Promise<boolean> => {
  if (TOKEN) {
    const res = await mailerSend.email.send(email)
    if (res.statusCode !== 202) throw new Error('Mail error: ' + res.body)
    return true
  } else {
    console.warn('No email token: email skip!')
    return false
  }
}

/**
 * Subscribe
 * @param email Email
 * @param userid User id
 */
const subscribe = async (email: string, userid: string): Promise<void> => {
  // Create link
  const link = await Link.add({ type: SUBSCRIBE, email, userid })

  const subscribeLink = DOMAIN + '/signup/validation?id=' + link.id

  const sender = new Sender('noreply@tanatloc.com', 'Tanatloc')
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
    .setFrom(sender)
    .setTo(recipients)
    .setSubject('Tanatloc subscription')
    .setTemplateId('3vz9dle2p6lkj50y')
    .setPersonalization(personalization)

  try {
    if (!(await send(emailParams))) {
      // No Email token -> validate user
      await User.update({ id: userid }, [
        {
          key: 'isvalidated',
          value: true
        }
      ])
    }
  } catch (err) {
    await Link.del(link)
    throw err
  }
}

/**
 * Recover
 * @param email Email
 */
const recover = async (email: string): Promise<void> => {
  // Create link entry
  const link = await Link.add({ type: PASSWORD_RECOVERY, email })

  const recoveryLink = DOMAIN + '/password?id=' + link.id

  const sender = new Sender('noreply@tanatloc.com', 'Tanatloc')
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
    .setFrom(sender)
    .setTo(recipients)
    .setSubject('Recover your password')
    .setTemplateId('vywj2lp7n1l7oqzd')
    .setPersonalization(personalization)

  try {
    await send(emailParams)
  } catch (err) {
    await Link.del(link)
    throw err
  }
}

/**
 * Revalidate
 * @param email Email
 * @param userid User id
 * @returns Valid
 */
const revalidate = async (email: string, userid: string): Promise<boolean> => {
  // Create link
  const link = await Link.add({ type: REVALIDATE, email, userid })

  const subscribeLink = DOMAIN + '/signup/validation?id=' + link.id

  const sender = new Sender('noreply@tanatloc.com', 'Tanatloc')
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
    .setFrom(sender)
    .setTo(recipients)
    .setSubject('Validate your email')
    .setTemplateId('jy7zpl9xq5l5vx6k')
    .setPersonalization(personalization)

  try {
    return await send(emailParams)
  } catch (err) {
    await Link.del(link)
    throw err
  }
}

/**
 * Invite
 * @param email Email
 * @param user Sending user
 */
const invite = async (
  email: string,
  user: { email: string; firstname?: string; lastname?: string }
): Promise<void> => {
  const subscribeLink = DOMAIN + '/login'

  const sender = new Sender('noreply@tanatloc.com', 'Tanatloc')
  const recipients = [new Recipient(email)]
  let userName = ''
  if (user.firstname || user.lastname) {
    user.firstname && (userName = user.firstname + '')
    user.lastname && (userName += user.lastname)
  } else {
    userName = user.email
  }
  const personalization = [
    {
      email,
      data: {
        user: userName,
        subscribeLink
      }
    }
  ]

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setSubject('Your have been invited')
    .setTemplateId('jy7zpl9x95l5vx6k')
    .setPersonalization(personalization)

  await send(emailParams)
}

const Email = { subscribe, recover, revalidate, invite }
export default Email
