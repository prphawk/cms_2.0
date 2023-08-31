import { Committee } from '@prisma/client'
import { Theme } from 'next-auth/core/types'
import { SendVerificationRequestParams } from 'next-auth/providers'
import { createTransport } from 'nodemailer'
import { _toLocaleExtendedString, _toLocaleString } from '~/utils/string'

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params
  const { host } = new URL(url)
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport({ service: 'gmail', auth: provider.server.auth })
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `CMS 2.0: Acesse ${host}`,
    text: text({ url, host }),
    html: signInHTML({ url, host, theme })
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}

export async function sendImminentElectionNotification(to: string, committees: Committee[]) {
  const transport = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  })
  const result = await transport.sendMail({
    to,
    from: process.env.EMAIL_FROM,
    subject: `CMS 2.0: Eleições Iminentes! (${committees.length})`,
    text: electionText(committees),
    html: electionHTML(committees)
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function signInHTML(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, '&#8203;.')

  const brandColor = theme.brandColor || '#567be0'
  const buttonText = theme.buttonText || '#fff'

  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Entre com a sua conta em <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Entrar</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se você não solicitou este e-mail, pode ignorá-lo com segurança.
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

function electionHTML(committees: Committee[]) {
  const strArr = committees.map(
    (c) =>
      `<li style="font-size: 18px; color:#303030">${c.name} (${_toLocaleExtendedString(
        c.end_date
      )})</li>`
  )

  return `<body style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color:#303030;">
      <h1 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color:#404040">
      CMS 2<span style="color:#d98ba1">.</span>0
      </h1>
      <hr style="border: #999999 1px solid">
      <p style="color:#303030;">Atenção! Os seguintes mandatos precisam de novas eleições: ${strArr.join(
        ''
      )}</p>
      <div style="font-size: 16px; color:#404040;">
      — Committee Management System 2.0
      <hr style="border: #999999 1px solid">
      <span style="font-size: 12px;">
      <a href="cms-2.vercel.app/dashboard/templates">Desativar as notificações por e-mail</a> | Feedback? Contate <a href="mailto:${
        process.env.EMAIL_DEVELOPER
      }">Mayra Cademartori</a>
      </span>
      </div>
      </body>`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function electionText(committees: Committee[]) {
  const strArr = committees.map((c) => `- ${c.name} (${_toLocaleExtendedString(c.end_date)})`)
  return `Atenção! Os seguintes mandatos precisam de novas eleições:\n\n ${strArr.join('\n')}\n\n
  — Committee Management System 2.0 (Feedback? Contate Mayra Cademartori <${
    process.env.EMAIL_DEVELOPER
  }>)
  `
}
