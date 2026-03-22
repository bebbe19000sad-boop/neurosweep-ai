import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { razorpay, PLANS } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planKey } = await req.json();
    const plan = (PLANS as any)[planKey.toUpperCase()];

    if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const options = {
      amount: plan.price * 100, // Razorpay expects amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        amount: plan.price * 100,
        currency: "INR",
        status: "pending",
        razorpayOrderId: order.id,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("RAZORPAY_ORDER_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
