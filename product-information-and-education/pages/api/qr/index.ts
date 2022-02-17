import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'
import { QrCodeIntentType } from '@openscreen/sdk'

/**
 * REST API for Openscreen QR codes.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    // create QR code
    case 'POST':
      // validate request body
      const { assetId, intent, intentType } = req.body
      if (!assetId || typeof assetId != 'string') {
        res.status(400).end('Invalid asset id')
        return
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
      // create qr code object
      try {
        let qrCode = await os
          .asset(assetId)
          .qrCodes()
          .create({
            intentState: { state: 'Pending' },
            intent,
            intentType,
          })
        res.status(200).json(qrCode)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
