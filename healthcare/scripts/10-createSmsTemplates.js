const context = require('./00-context')

module.exports = async () => {

  const {osProject} = context
  const osSmsTemplates = osProject.smsTemplates()


  const patientCodeTemplate = await osSmsTemplates.create({
    body: `Please enter the following code to access your prescription, issued by {asset.customAttributes.doctorName}: {asset.customAttributes.patientCode}`,
    smsTemplateName: "patientCode",
  })


  const pharmacistCodeTemplate = await osSmsTemplates.create({
    body: `Please enter the following code to access the prescription for {asset.customAttributes.patientName}: {asset.customAttributes.pharmacistCode}`,
    smsTemplateName: "pharmacistCode",
  })
}
