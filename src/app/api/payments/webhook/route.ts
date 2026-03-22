import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentData = event.payload.payment.entity;
      const orderId = paymentData.order_id;

      // Find pending subscription with this order ID
      const paymentRecord = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      });

      if (paymentRecord) {
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: "completed",
            razorpayPaymentId: paymentData.id,
          }
        });

        // Add credits or upgrade plan
        // e.g., if bought 1000 credits for 500 INR
        if (paymentRecord.amount === 50000) { // 500 INR in paise
          await prisma.user.update({
            where: { id: paymentRecord.userId },
            data: { credits: { increment: 1000 } }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
