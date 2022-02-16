import { NextApiRequest, NextApiResponse } from 'next'
import os, { projectId } from '@os/index'
import { QrCodeIntentType } from '@openscreen/sdk'

/**
 * REST API for Openscreen assets.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    // get all assets
    case 'GET':
      const { assetName } = req.query
      try {
        let assets = await os.project(projectId).assets().get({})

        if (assetName) {
          assets.assets = assets.assets?.filter(
            (asset) => asset.name == assetName
          )
        }

        res.status(200).json(assets)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // create asset
    case 'POST':
      // validate request body
      const { name, description, intent, intentType } = req.body
      if (!name || typeof name !== 'string') {
        res.status(400).end('Invalid asset name')
      }
      if (!intent || typeof intent !== 'string') {
        res.status(400).end('Invalid asset intent')
      }
      if (
        !intentType ||
        !Object.values(QrCodeIntentType).includes(intentType)
      ) {
        res.status(400).end('Invalid intent type')
      }

      // create asset object
      try {
        const asset = await os
          .project(projectId)
          .assets()
          .create({
            name,
            description,
            qrCodes: [
              {
                intent,
                intentType,
              },
            ],
          })
        res.status(200).json(asset)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
