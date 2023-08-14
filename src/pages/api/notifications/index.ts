import { NextApiRequest, NextApiResponse } from 'next'
import { getEmails, getNotifications, updateLastSent } from '~/server/api/routers/template'
import { sendEminentElectionNotification } from '~/server/auth/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

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
        body: templates,
        cookies: req.cookies
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      body: error,
      cookies: req.cookies
    })
  }
  res.status(204).end() //.redirect(req.cookies.)
}
