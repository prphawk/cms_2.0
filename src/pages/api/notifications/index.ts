import { NextApiRequest, NextApiResponse } from 'next'
import { getUsersForNotifications, updateLastSent } from '~/server/api/routers/template'
import { sendImminentElectionNotification } from '~/server/auth/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  console.log('Running notifications job...')
  try {
    const usersWithNotifs = await getUsersForNotifications()
    if (usersWithNotifs.length) {
      const promises = usersWithNotifs.map((u) => {
        const committees = u.notifications.map((n) => n.committee)
        sendImminentElectionNotification(u.email!, committees)
        return updateLastSent(u.notifications)
      })

      await Promise.all(promises)
      return res.status(200).json({
        body: 'OK!',
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
