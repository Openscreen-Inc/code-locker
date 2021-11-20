const { Openscreen } = require('@openscreen/sdk');

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
});

const getPatientByScanId = async (event) => {
  const {scanId} = event.pathParameters;
  const scan = await os.scan(scanId).get()
  const asset = await os.asset(scan.assetId).get()
  const code = Math.floor(Math.random() * 10000)
  os.scan(scanId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      ...asset,
    }),
  };
};

const updateAsset = async (event) => {
  const { id } = event.pathParameters

  const newCustomAttributes = JSON.parse(event.body);

  await os.asset(id).update({
    customAttributes: {
      ...newCustomAttributes,
    },
  });

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

const getAssetsByBatch = async (event) => {
  const { batchId } = event.pathParameters;

  const { assets } = await os.project(process.env.PROJECT_ID).assets().get();
  const filtered = assets.filter(asset => asset.customAttributes.batchId === batchId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      filtered,
    }),
  };
};

module.exports = { getAssetsByBatch, getScan, updateAsset };
