//----------------------------------------------------------------- intent flow request object body --
const intentFlow = {
  intentType: 'DYNAMIC_REDIRECT_TO_APP',
  intent: `${process.env.NGROK_URL}`,
};

//----------------------------------------------------------- uploaded contact request object body --
function generateContactObj(json) {
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
    consent: {
      url: json.url,
      consentedAt: new Date().toISOString,
      consented: json.consented,
    },
    cellPhone: `+1${json.cellPhone}`,
    customAttributes: {
      id: json.id,
    },
  };

  return createContact;
}

module.exports = { intentFlow, generateContactObj };
