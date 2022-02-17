import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'

/**
 * API for unlinking contacts with assets.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { contactId, assetId },
  } = req

  if (!contactId || typeof contactId !== 'string') {
    res.status(400).end('Invalid contact id')
  }
  if (!assetId || typeof assetId !== 'string') {
    res.status(400).end('Invalid asset id')
  }

  switch (method) {
    // destroy link between asset and contact
    case 'POST':
      try {
        const contact = await os.asset(assetId).contact(contactId).unlink()
        res.status(200).json(contact)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
