import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'
import { QrCodeType } from '@openscreen/sdk'

/**
 * REST API for Openscreen QR codes.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id },
  } = req

  if (typeof id != 'string') {
    res.status(400).end('Invalid qr code id')
    return
  }

  switch (method) {
    // create QR code
    case 'GET':
      try {
        const qrCode = await os.qrCode(id).get({
          format: QrCodeType.PNG,
          scale: 12,
          lightColor: '#ffffff',
          darkColor: '#0a74b7',
          dataUrl: true,
        })
        await os.saveQrImageDataToFile(qrCode, 'public/qr-code.png')
        res.status(200).json(qrCode)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // update QR code
    case 'PUT':
      const { intent, intentType, intentState } = req.body
      try {
        const result = await os
          .qrCode(id)
          .update({ intent, intentType, intentState })
        res.status(200).json(result)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
