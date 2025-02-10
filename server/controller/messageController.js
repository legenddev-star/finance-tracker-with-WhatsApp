const User = require('../models/User');
const { sendMessage } = require('../services/sendMessage');
const { addExpenses, showExpenses } = require('../services/expenses');
const { toTitleCase } = require("../utils/stringUtils");

exports.verifyUserNumber = async (req, res, next) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    try {
        const userId = req.user;
        const user = await User.findById(userId, "-password");
        // console.log("🚀 ~ file: messageController.js:17 ~ exports.twilioMsgStatus= ~ user:", user)

        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `
            Hello ${user.fullName} 👋 You are *verified* 🎉 

Welcome to Expense Tracker. Get started tracking your small expenses.
Send _'add'_ followed by the product name and price. For example: *Add apple 30*
Send _'show'_ to see your total expenses.

Thanks for using Expense Tracker.
            `,
            to: `whatsapp:+91${user.phone}`
        });

        const messageInfo = await client.messages(message.sid).fetch();

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Retrieve the final status of the message
        const isSent = messageInfo.status === 'delivered' || messageInfo.status === 'sent' || messageInfo.status === 'read';

        // Check if message sent to correct phone number
        const isNumberVerified = messageInfo.to === 'whatsapp:+91' + user.phone

        if (isSent && isNumberVerified) {
            res.status(201).json({ "status": messageInfo });
        } else {
            res.status(400).json({ "status": messageInfo })
        }

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


exports.receiveMessage = async (req, res, next) => {
    const from = req.body.From;
    const body = req.body.Body;

    // phone number format is 'whatsapp:+91XXXXXXXXXX'
    const phoneNumber = from.substring(12); // Extract the phone number from the 'From' field

    const user = await User.findOne({ phone: phoneNumber }, "-password");


    // Check if the sentence contains the word "add" or "Add" or "show" or "Show"
    if (/(^|\s)(add|Add|show|Show)($|\s)/.test(body)) {
        // Check if the sentence contains the word "add" or "Add"
        if (/(^|\s)(add|Add)($|\s)/.test(body)) {
            // Extract product and price using RegEx
            const match = /add\s+([\w\s]+)\s+(\d+)/i.exec(body);
            if (match) {
                const product = toTitleCase(match[1]);
                // console.log("🚀 ~ file: messageController.js:71 ~ exports.receiveMessage= ~ product:", product)
                const price = Number(match[2]);


                const productText = await addExpenses(user._id, product, price);
                sendMessage(user.phone, productText);
            } else {
                sendMessage(user.phone, 'Invalid sentence');
                return res.status(400).json({ error: 'Invalid sentence' });
            }
        } else {
            // Handle the case when the sentence contains the word "show" or "Show"
            const data = await showExpenses(user._id);
            let dataString = ""
            let totalExpenses = 0
            for (let i = 0; i < data.expenses.length; i++) {
                dataString += `Product - ${data.expenses[i].product}, Price - ${data.expenses[i].price}\n`;
                totalExpenses += data.expenses[i].price
            }
            sendMessage(user.phone, dataString);
            sendMessage(user.phone, `💰 Total expenses: *${totalExpenses}*`);
        }
    } else {
        sendMessage(user.phone, 'Invalid sentence');
        return res.status(400).json({ error: 'Invalid sentence' });
    }

}