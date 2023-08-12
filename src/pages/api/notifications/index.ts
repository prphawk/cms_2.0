import { Template, Committee } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getEmails, getNotifications } from '~/server/api/routers/template'
import { sendEminentElectionNotification } from '~/server/auth/email'
import { api } from '~/utils/api'

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  //const { searchParams } = request.nextUrl;
  //const hasTitle = searchParams.has('title');
  // const title = hasTitle
  //   ? searchParams.get('title')?.slice(0, 100)
  //   : 'My default title';

  //return res.status(500).send(title);

  try {
    const templates = await getNotifications()
    const emails = await getEmails()
    if (templates.length && emails.length) {
      const promises = emails.map((e) =>
        sendEminentElectionNotification(e.email!, templates as any)
      )
      Promise.all(promises)
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
  return res.status(304).json({
    body: 'ok!',
    cookies: request.cookies
  })
}
