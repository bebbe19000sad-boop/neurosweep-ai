import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey, userId } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const plan = (PLANS as any)[planKey.toUpperCase()];
      
      // Update User Credits and Create Subscription record
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { 
            credits: { increment: plan.credits } 
          }
        }),
        prisma.subscription.create({
          data: {
            userId,
            plan: planKey,
            paymentId: razorpay_payment_id,
            status: "active"
          }
        })
      ]);

      return NextResponse.json({ message: "Payment verified and credits added" });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("RAZORPAY_VERIFY_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
