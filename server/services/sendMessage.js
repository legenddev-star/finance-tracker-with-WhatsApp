
const sendMessage = async (phone, text) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const message = client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `${text}`,
            to: `whatsapp:+91${phone}`
        }).catch(error => {
            // console.log("🚀 ~ file: sendMessage.js:14 ~ sendMessage ~ error:", error)
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: `${text}`,
                to: `whatsapp:+91${phone}`
            })
        })
    } catch (error) {
        // console.log("🚀 ~ file: sendMessage.js:22 ~ sendMessage ~ error:", error)
    }
}

module.exports = { sendMessage }