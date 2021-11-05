const { Openscreen } = require('@openscreen/sdk');

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
});

module.exports.sendSms = async (event) => {
  const { to, smsTemplateName, scanId } = JSON.parse(event.body);

  await os.scan(scanId).smss().create({
    smsTemplateName,
    to,
  });

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    statusCode: 200,
  };
};
