
const Captcha = require('2captcha') 
exports.getResolvedCaptchaKey = async function() {
  const solver = new Captcha.Solver('a37e8fe947ab4bcc5b711aece70b9124')
  const response = await solver.hcaptcha('e33f87f8-88ec-4e1a-9a13-df9bbb1d8120', 'https://jobs.lever.co/userlane/19b969e3-e406-486c-82e6-483f62fe597f/apply')
  return response.data
}