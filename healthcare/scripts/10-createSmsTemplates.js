const context = require('./context')

module.exports = async () => {

  const {osProject} = context
  const osSmsTemplates = osProject.smsTemplates()


  const patientCodeTemplate = await osSmsTemplates.create({
    body: `Please enter the following code to access your prescription, issued by {asset.customAttributes.doctorName}: {asset.customAttributes.patientCode}`,
    smsTemplateName: "patientCode"
  })
  console.log(`Patient Code SMS Template: `, JSON.stringify(patientCodeTemplate, ' ', 2))


  const pharmacistCodeTemplate = await osSmsTemplates.create({
    body: `Please enter the following code to access the prescription for {asset.customAttributes.patientName}: {asset.customAttributes.pharmacistCode}`,
    smsTemplateName: "patientCode"
  })
  console.log(`Phamracist Code SMS Template: `, JSON.stringify(pharmacistCodeTemplate, ' ', 2))


  context.assign({
    patientCodeTemplateId: patientCodeTemplate.id,
    pharmacistCodeTemplateId: pharmacistCodeTemplate.id
  })
}
