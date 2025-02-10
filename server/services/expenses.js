const User = require('../models/User');

const addExpenses = async (id, product, price) => {
    try {
        const response = await User.findByIdAndUpdate(id, {
            $push: {
                expenses: {
                    product: product,
                    price: price
                }
            }
        });
        const text = `✅ ${product} added with ${price}.`;
        return text;
    } catch (error) {
        // console.log("🚀 ~ file: expenses.js:15 ~ addExpenses ~ error:", error);
        throw error;
    }
};



const showExpenses = async (id) => {
    try {
        const expenses = await User.findById(id);
        return expenses;
    } catch (error) {
        return error
    }
}


module.exports = {
    addExpenses,
    showExpenses
}