import { NextApiRequest, NextApiResponse } from 'next'
import os, { projectId } from '@os/index'
import { QrCodeIntentType, UpdateAssetRequestBody } from '@openscreen/sdk'

/**
 * REST API for Openscreen assets.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  if (typeof id !== 'string') {
    res.status(400).end('Invalid asset id')
    return
  }

  switch (method) {
    // get asset with id
    case 'GET':
      try {
        const asset = await os.asset(id).get()
        res.status(200).json(asset)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // update asset
    case 'PUT':
      const body = req.body as UpdateAssetRequestBody
      try {
        const asset = await os.asset(id).update(body)
        res.status(200).json(asset)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // delete asset
    case 'DELETE':
      try {
        const result = await os.asset(id).delete()
        res.status(200).json(result)
      } catch (err) {
        res.status(500).json(err)
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
