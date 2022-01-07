const PrescriptionStates = require('../../common/PrescriptionStates')
const ContactRoles = require('../../common/ContactRoles')
const response = require('./response')
const {Openscreen} = require('@openscreen/sdk')
const {OS_KEY, OS_SECRET} = process.env

modules.exports = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
})

/***
 * GET /pharmacist/pppppppp-pppp-pppp-pppp-pppppppppppp
 */
const getPharmacistByScanId = async (event) => {
  const {scanId} = event.pathParameters
  return response()
}

/***
 * PATCH /pharmacist/pppppppp-pppp-pppp-pppp-pppppppppppp
 */
const updatePharmacistByScanId = async (event) => {
  const {scanId} = event.pathParameters
  return response()
}

module.exports = {getPharmacistByScanId, updatePharmacistByScanId}
