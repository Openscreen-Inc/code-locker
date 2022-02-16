import { NextApiRequest, NextApiResponse } from 'next'
import os, { projectId } from '@os/index'

/**
 * REST API for Openscreen projects.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    // get project
    case 'GET':
      try {
        const project = await os.project(projectId).get({})
        res.status(200).json(project)
      } catch (err) {
        res.status(500).json(err)
      }
      break
    // create contact
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
