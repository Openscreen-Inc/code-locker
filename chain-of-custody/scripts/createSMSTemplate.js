require('dotenv').config();
const { Openscreen } = require('@openscreen/sdk');

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
});

// create SMS Templates here
const createSmsTemplates = async () => {
  const validationComplete = await os.project(process.env.PROJECT_ID).smsTemplates().create({
    body: `Carbon Validation for {asset.customAttributes.soilSampleId} complete`,
    smsTemplateName: "validationComplete"
  })

  console.log("validationComplete", validationComplete)

  const dataSubmitted = await os.project(process.env.PROJECT_ID).smsTemplates().create({
    body: "Your data has been submitted to the Deveron Cloud",
    smsTemplateName: "dataSubmitted"
  })

  console.log("dataSubmitted", dataSubmitted)

  const fieldDataSubmitted = await os.project(process.env.PROJECT_ID).smsTemplates().create({
    body: "Your field's data has been submitted to the Deveron Cloud",
    smsTemplateName: "fieldDataSubmitted"
  })

  console.log("fieldDataSubmitted", fieldDataSubmitted)
}

createSmsTemplates()