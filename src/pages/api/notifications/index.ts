import { NextApiRequest, NextApiResponse } from 'next'
import { getEmails, getNotifications, updateLastSent } from '~/server/api/routers/template'
import { sendEminentElectionNotification } from '~/server/auth/email'

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  console.log('Running notifications job...')
  try {
    const templates = await getNotifications()
    const emails = await getEmails()
    if (templates.length && emails.length) {
      const promises = emails.map((e) =>
        sendEminentElectionNotification(e.email!, templates as any)
      )
      await Promise.all(promises)
      await updateLastSent(templates)
      return res.status(200).json({
        body: 'Success!',
        cookies: request.cookies
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      body: error,
      cookies: request.cookies
    })
  }
  res.status(204).end()
}
