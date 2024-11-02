const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed' });
    }
};

module.exports = { processPayment };
