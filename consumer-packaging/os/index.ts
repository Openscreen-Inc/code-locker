import { Openscreen } from '@openscreen/sdk'

const os = new Openscreen().config({
  key: process.env.OS_API_KEY,
  secret: process.env.OS_API_SECRET,
})

export const projectId = process.env.PROJECT_ID || ''

export default os
