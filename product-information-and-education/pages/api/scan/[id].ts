import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'

/**
 * REST API for Openscreen scans.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  if (typeof id != 'string') {
    res.status(404).end('Invalid scan id')
    return
  }

  switch (method) {
    // get scan with id
    case 'GET':
      try {
        const asset = await os.scan(id).get()
        res.status(200).json(asset)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
