import Stripe from "stripe";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

// This function handles incoming Stripe webhook events.
// It verifies the event signature and processes the events.
export const stripeWebhooks = async (request, response) => {
  // Initialize Stripe with the secret key from environment variables.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // Get the Stripe signature from the request headers.
  const sig = request.headers["stripe-signature"];

  let event;

  // Verify the event signature to ensure the request is from Stripe.
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // If signature verification fails, return a 400 error.
    console.error(`Webhook signature verification failed: ${error.message}`);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the different types of events.
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        {
          // Retrieve the payment intent object from the event data.
          const paymentIntent = event.data.object;

          // List all checkout sessions related to this payment intent.
          const sessionList = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
          });

          // Get the first session from the list.
          const session = sessionList.data[0];
          // Extract the transaction ID and app ID from the session metadata.
          const { transactionId, appId } = session.metadata;

          // Check if the app ID matches the expected value.
          if (appId === "quickgpt") {
            // Find the transaction in the database that is not yet paid.
            const transaction = await Transaction.findOne({
              _id: transactionId,
              isPaid: false,
            });

            if (transaction) {
              // Update the user's credits by incrementing them with the transaction's credit amount.
              await User.updateOne(
                { _id: transaction.userId },
                { $inc: { credits: transaction.credits } }
              );

              // Mark the transaction as paid and save the changes.
              transaction.isPaid = true;
              await transaction.save();
            }
          }
        }
        break;
      default:
        // Log any unhandled event types for debugging purposes.
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    // Respond with a 200 OK status to acknowledge receipt of the event.
    response.json({ received: true });
  } catch (error) {
    // If any other error occurs during processing, return a 500 status.
    console.error(`Internal server error: ${error.message}`);
    response.json({ message: "internal server error" });
  }
};
