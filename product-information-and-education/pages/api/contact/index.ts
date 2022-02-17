import { NextApiRequest, NextApiResponse } from 'next'
import os, { projectId } from '@os/index'
import {
  CreateContactByAssetIdResponseBody,
  CreateContactByProjectIdRequestBody,
  CreateContactByProjectIdResponseBody,
  CreateContactByScanIdResponseBody,
} from '@openscreen/sdk'

interface CreateContactRequestBody extends CreateContactByProjectIdRequestBody {
  scanId?: string
  assetId?: string
}

/**
 * REST API for Openscreen contacts.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    // get all contacts
    case 'GET':
      try {
        const contacts = await os.project(projectId).contacts().get({})
        res.status(200).json(contacts)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // create contact
    case 'POST':
      const body = req.body as CreateContactRequestBody
      let contact:
        | CreateContactByProjectIdResponseBody
        | CreateContactByScanIdResponseBody
        | CreateContactByAssetIdResponseBody
      try {
        if (body.scanId) {
          contact = await os.scan(body.scanId).contacts().create(body)
        } else if (body.assetId) {
          contact = await os.asset(body.assetId).contacts().create(body)
        } else {
          contact = await os.project(projectId).contacts().create(body)
        }
        res.status(200).json(contact)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
