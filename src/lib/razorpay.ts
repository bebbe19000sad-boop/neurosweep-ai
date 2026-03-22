import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const PLANS = {
  FREE: { name: "Free", credits: 10, price: 0 },
  PRO: { name: "Pro", credits: 100, price: 999 }, // Price in paise (INR 9.99 for example)
  UNLIMITED: { name: "Unlimited", credits: 1000, price: 2999 },
};
