import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'

/**
 * REST API for Openscreen scans.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    // get all scans
    case 'GET':
      const { assetId } = req.query
      if (!assetId || typeof assetId !== 'string') {
        res.status(400).end('Invalid asset id')
        return
      }
      try {
        const scans = await os.asset(assetId).scans().get({})
        res.status(200).json(scans)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
