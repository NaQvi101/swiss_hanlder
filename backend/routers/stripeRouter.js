import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isSeller, subscriptionValidation } from "../utils.js";
import User from "../models/userModel.js";
import Subscription from "../models/subscriptionModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey);
const stripeRouter = express.Router();

stripeRouter.post(
  "/create-payment-intent",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { totalPrice } = req.body;
    console.log("totalPrice", totalPrice);

    try {
      // Create a PaymentIntent with the total amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Amount in cents
        currency: "usd",
      });

      res.status(201).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ message: error.message });
    }
  })
);


stripeRouter.post('/checkout-session', isAuth, subscriptionValidation, async (req, res) => {
  try {
    const { plan, userInfo } = req.body;

    // Validate inputs
    if (!plan || !userInfo) {
      return res.status(400).send({ message: 'Plan and user info are required.' });
    }

    if (plan === '8-month' && userInfo.subscription !== null) {
      return res.status(400).send('8-month plan can only be used for first-time users.');
    }

    const priceId = plan === '8-month' ? process.env.EIGHT_MONTH_PRICE_ID : process.env.ANNUAL_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://www.swisshandel.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://www.swisshandel.com/subscription?cancel=true`,
      metadata: {
        userId: userInfo._id,
        plan: plan,
      },
    });

    res.send({ url: session.url }); // Return URL to the frontend
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ message: 'Error creating checkout session.' });
  }
});



stripeRouter.post('/payment-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      const startDate = new Date(); // Initialize start date
      const endDate = plan === 'annual' ? new Date(new Date(startDate).setFullYear(startDate.getFullYear() + 1)): new Date(new Date(startDate).setMonth(startDate.getMonth() + 6));
      const subscription = new Subscription({
        userId,
        plan,
        stripeSubscriptionId: session.id,
        startDate,
        endDate,
        status: 'active',
      });

      await subscription.save();

      // Update user with subscription
      await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    }

    res.status(200).send({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

stripeRouter.post('/checkout-session/:sessionId', isAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


export default stripeRouter;
