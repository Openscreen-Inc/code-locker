//------------------------------------------------------------ Global Imports --
import {Openscreen} from '@openscreen/sdk'

//---------------------------------------------------------- Relative Imports --
import {pass, fail} from '../lib'

const {FRONTEND_URL, OS_KEY, OS_SECRET, PROJECT_ID} = process.env

//------------------------------------------------------------------- QrCodes --
export class QrCodes {
  constructor(input = {}) {
    const {key, secret, projectId, ...rest} = input

    this.os = new Openscreen().config({
      key: key ?? OS_KEY,
      secret: secret ?? OS_SECRET,
      ...rest,
    })

    this.projectId = projectId ?? PROJECT_ID

    this.project = this.os.project(this.projectId)
    this.assets = this.project.assets()
  }

  //----------------------------------------------------------- createAsset ----
  createAsset({id, name, description, ...custom}) {
    return this.project
      .assets()
      .create({
        name,
        description,
        customAttributes: {id, ...custom},
        qrCodes: [{intent: `${FRONTEND_URL}/scan`, intentType: 'DYNAMIC_REDIRECT_TO_APP'}],
      })
      .then(pass)
      .catch(fail)
  }

  //----------------------------------------------------------- updateAsset ----
  updateAsset(assetId, {name, description, customAttributes}) {
    return this.os
      .asset(assetId)
      .update({name, description, customAttributes})
      .then(({asset}) => pass(asset))
      .catch(fail)
  }

  //------------------------------------------------------------- getAssets ----
  getAssets() {
    return this.assets
      .get()
      .then(({assets}) => pass(assets))
      .catch(fail)
  }

  //------------------------------------------------------------- getQrCode ----
  getQrCode(qrCodeId) {
    return this.os.qrCode(qrCodeId).get({format: 'PNG', dataUrl: true}).then(pass).catch(fail)
  }

  //--------------------------------------------------------------- getScan ----
  getScan(scanId) {
    return this.os.scan(scanId).get().then(pass).catch(fail)
  }

  //-------------------------------------------------------------- getScans ----
  getScans(assetId) {
    return this.os
      .asset(assetId)
      .scans()
      .get()
      .then(({scans}) => pass(scans))
      .catch(fail)
  }
}

export default QrCodes
