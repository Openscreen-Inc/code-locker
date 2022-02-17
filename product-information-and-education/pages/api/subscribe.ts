import { NextApiRequest, NextApiResponse } from 'next'
import os, { projectId } from '@os/index'
import { ContactConsent } from '@openscreen/sdk'

/**
 * API for handling email subscriptions.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'POST':
      // validate email
      const { email, origin } = req.body
      if (!email) {
        res.status(400).end('Email is required')
        return
      }
      if (typeof email != 'string') {
        res.status(400).end('Email must be a string')
        return
      }
      if (email.length == 0) {
        res.status(400).end('Invalid email')
        return
      }
      // create consent object to add to contact
      const newConsent: ContactConsent = {
        url: origin,
        consentedAt: Date.now(),
        consented: true,
      }
      // if contact with this email exists, update the consent field
      const contacts = await os.project(projectId).contacts().get({})
      let existingContact = contacts.contacts?.find(
        (c) => c.emailAddress == email
      )
      if (existingContact) {
        const consent = existingContact.consent || []
        const contactId = existingContact.contactId || ''
        await os.contact(contactId).update({
          consent: [...consent, newConsent],
        })
      }
      // if contact does not exist, create a new contact object
      else {
        await os
          .project(projectId)
          .contacts()
          .create({
            emailAddress: email,
            consent: [newConsent],
          })
      }
      res.status(200).end('Subscribed')
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} not allowed`)
  }
}
