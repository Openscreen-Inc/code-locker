import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'

/**
 * API for linking contacts with assets.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { contactId, assetId, typeOfLink },
  } = req

  if (!contactId || typeof contactId !== 'string') {
    res.status(400).end('Invalid contact id')
  }
  if (!assetId || typeof assetId !== 'string') {
    res.status(400).end('Invalid asset id')
  }
  if (!typeOfLink || typeof typeOfLink !== 'string') {
    res.status(400).end('Invalid type of link')
  }

  switch (method) {
    // create link between asset and contact
    case 'POST':
      try {
        const contact = await os
          .asset(assetId)
          .contact(contactId)
          .link(typeOfLink)
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
