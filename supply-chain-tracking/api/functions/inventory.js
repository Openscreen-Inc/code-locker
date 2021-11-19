import {QrCodes} from '../domain/qrcodes'
import {Inventory} from '../domain/inventory'

import {success, failure, log, uuid, middleware} from '../lib'

const inventory = new Inventory()

const qr = new QrCodes({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
  projectId: process.env.PROJECT_ID,
})

//---------------------------------------------------------- listItemsHandler --
async function listItemsHandler(event) {
  log('EVENT:', event)

  const response = await inventory.scan()

  if (response.error) return failure(response.error)

  return success(response.data)
}

//------------------------------------------------------------ getItemHandler --
async function getItemHandler(event) {
  log('EVENT:', event)
  const {id} = event.pathParameters

  const response = await inventory.get(id)

  if (response.error) return failure(response.error)

  return success(response.data)
}

//--------------------------------------------------------- deleteItemHandler --
async function deleteItemHandler(event) {
  log('EVENT:', event)
  const {id} = event.pathParameters

  const response = await inventory.delete(id)

  if (response.error) return failure(response.error)

  return success(response.data)
}

//--------------------------------------------------------- createItemHandler --
async function createItemHandler(event) {
  log('EVENT:', event)
  const {type, name, description} = event.body

  // Get a new ID (this will link our QR asset to our Inventory asset)
  const id = uuid()

  // Create a new Openscreen asset in our project
  const assetResponse = await qr.createAsset({id, name, description})

  log('ASSET:', assetResponse)
  if (assetResponse.error) return failure(assetResponse.error)

  const {qrCodeId} = assetResponse.data.asset.qrCodes[0]

  // Get the QR code associated with our asset.
  const qrResponse = await qr.getQrCode(qrCodeId)

  log('QRCODE:', qrResponse)
  if (qrResponse.error) return failure(qrResponse.error)

  /**
   * Get the QR code image and create the new item in our inventory.
   * NOTE: The QR code image is stored in our DB for simplicity and
   * is not recommended for approach for production applications.
   */
  const qrcode = qrResponse.data.image.data

  const response = await inventory.create({id, type, name, description, qrcode})

  if (response.error) return failure(response.error)

  return success(response.data)
}

//--------------------------------------------------------- updateItemHandler --
async function updateItemHandler(event) {
  log('EVENT:', event)
  const {id, type, status, condition, renter} = event.body

  const response = await inventory.update({id, type, status, condition, renter})

  if (response.error) return failure(response.error)

  return success(response.data)
}

//------------------------------------------------------------ getScanHandler --
async function getScanHandler(event) {
  log('EVENT:', event)
  const scanId = event.pathParameters.id

  // Retrieve the scan information from Openscreen.
  const response = await qr.getScan(scanId)

  if (response.error) return failure(response.error)

  // Get the inventory id we specified in our "customAttributes" field.
  const {id} = response.data.asset.customAttributes

  const dbResponse = await inventory.get(id)

  if (dbResponse.error) return failure(dbResponse.error)

  return success(dbResponse.data)
}

//------------------------------------------------------------------- exports --
export const getScan = middleware(getScanHandler)
export const getItem = middleware(getItemHandler)
export const listItems = middleware(listItemsHandler)
export const deleteItem = middleware(deleteItemHandler)
export const createItem = middleware(createItemHandler)
export const updateItem = middleware(updateItemHandler)
