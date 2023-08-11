import { NextApiRequest, NextApiResponse } from 'next'
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
    await sendEminentElectionNotification('mayra.cademartori@gmail.com', 'Committee X')
    return res.status(200).json({
      body: 'Success!',
      cookies: request.cookies
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      body: error,
      cookies: request.cookies
    })
  }
}
