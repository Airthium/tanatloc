declare module 'mailersend' {
  export class Recipient {
    constructor(email: string)
  }
  export class EmailParams {
    setFrom(email: string): EmailParams
    setFromName(name: string): EmailParams
    setRecipients(recipients: Recipient[]): EmailParams
    setSubject(subject: string): EmailParams
    setTemplateId(templateId: string): EmailParams
    setPersonalization(
      personalization: { email: string; data: any }[]
    ): EmailParams
  }
  export default class MailerSend {
    constructor(options: { api_key: string })
    send(email: EmailParams): Promise<{ status: number; statusText: string }>
  }
}
