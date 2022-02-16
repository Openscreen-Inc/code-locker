//----------------------------------------------------------------- intent flow request object body --
const intentFlow = {
  intent: `${process.env.NGROK_URL}`,
  intentType: 'DYNAMIC_REDIRECT_TO_APP',
};

//----------------------------------------------------------- uploaded contact request object body --
function generateContactObj(json) {
  let today = new Date();
  let sameDay = new Date(today);

  const createContact = {
    firstName: json.firstName,
    lastName: json.lastName,
    emailAddress: json.emailAddress,
    mailingAddress: {
      address: json.address,
      city: json.city,
      provinceOrState: json.provinceOrState,
      country: json.country,
      postalOrZip: json.postalOrZip,
    },
    consent: [{
      url: json.url,
      consentedAt: sameDay,
      consented: json.consented,
    }],
    cellPhone: `+1${json.cellPhone}`,
    customAttributes: {
      id: json.id,
    },
  };

  return createContact;
}

module.exports = { intentFlow, generateContactObj };
