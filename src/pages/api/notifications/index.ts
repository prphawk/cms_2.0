import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { NextApiRequest, NextApiResponse } from 'next'
import { appRouter } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'

/*
Observe que precisamos apenas exportar as definições de tipo do nosso roteador, o que significa que nunca importaremos nenhum código de servidor em nosso cliente.
https://create.t3.gg/pt/usage/trpc#-pagesapitrpctrpcts
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  console.log('Running notifications job...')

  const ctx = await createTRPCContext({ req, res })
  const caller = appRouter.createCaller(ctx)

  try {
    const promises = await caller.notification.sendNotifications()
    if (promises?.length > 0) {
      console.log('No notifications to send this time.')
      res.status(204).end()
      return
    }
    await Promise.all(promises)
    return res.status(200).json({ body: 'OK!' })
  } catch (error) {
    let code = 500
    if (error instanceof TRPCError) {
      code = getHTTPStatusCodeFromError(error)
    }
    console.error(error)
    return res.status(code).json({ error })
  }
}
