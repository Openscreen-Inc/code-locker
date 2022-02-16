import { NextApiRequest, NextApiResponse } from 'next'
import os from '@os/index'
import { UpdateContactRequestBody } from '@openscreen/sdk'

/**
 * REST API for Openscreen contacts.
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
    res.status(400).end('Invalid contact id')
    return
  }

  switch (method) {
    // get contact with id
    case 'GET':
      try {
        const contact = await os.contact(id).get()
        res.status(200).json(contact)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // update contact
    case 'PUT':
      let body = req.body as UpdateContactRequestBody
      try {
        const contact = await os.contact(id).update(body)
        res.status(200).json(contact)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // delete contact
    case 'DELETE':
      try {
        const result = await os.contact(id).delete()
        res.status(200).json(result)
      } catch (err) {
        res.status(500).json(err)
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
