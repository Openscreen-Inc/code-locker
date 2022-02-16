// load environment variables
const args = process.argv.slice(2)
if (args[0] && args[0] == 'production') {
  // production
  console.log('creating QR codes for production build...')
  require('dotenv').config({ path: '.env.prod' })
} else {
  // development
  console.log('creating QR codes for development build...')
  require('dotenv').config()
}

import os, { projectId } from './os/index'
import { soaps } from './data/soaps'
import { QrCodeIntentType, QrCodeType } from '@openscreen/sdk'

/**
 * Delete existing assets, create an asset for each soap product, then generate
 * QR codes for each asset.
 */
const initialize = async () => {
  try {
    // delete existing assets
    console.log('deleting all existing assets...')
    const assets = await os.project(projectId).assets().get({})
    for (let asset of assets.assets!) {
      await os.asset(asset.assetId!).delete()
    }
    // create soap assets and QR codes
    const publicUrl = process.env.PUBLIC_URL || ''
    for (let soap of soaps) {
      console.log(`creating asset for ${soap.name}...`)
      const intent = `${publicUrl}/products?name=${soap.id}`
      const asset = await os
        .project(projectId)
        .assets()
        .create({
          name: soap.id,
          description: `Redirects to the product page of ${soap.name}`,
          customAttributes: {
            name: soap.name,
            redirect: soap.url,
          },
          qrCodes: [
            {
              intent,
              intentType: QrCodeIntentType.DYNAMIC_REDIRECT,
            },
          ],
        })
      const qrCodeId = asset.asset?.qrCodes?.[0].qrCodeId
      if (qrCodeId) {
        const qrCode = await os.qrCode(qrCodeId).get({
          format: QrCodeType.PNG,
          scale: 12,
          lightColor: '#ffffff',
          darkColor: '#000000',
          dataUrl: true,
        })
        await os.saveQrImageDataToFile(qrCode, `public/qrcodes/${soap.id}.png`)
      }
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

initialize()
