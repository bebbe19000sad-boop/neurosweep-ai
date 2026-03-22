"use client";

import { useEffect } from "react";
import axios from "axios";

import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({ planKey, userId, onSuccess, className, children }: { planKey: string, userId?: string, onSuccess?: () => void, className?: string, children?: React.ReactNode }) {
  const { data: session } = useSession();
  const effectiveUserId = userId || (session?.user as any)?.id;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post("/api/payments/order", { planKey });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "NeuroSweep AI",
        description: `Upgrade to ${planKey} plan`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await axios.post("/api/payments/verify", {
              ...response,
              planKey,
              userId: effectiveUserId
            });
            alert("Payment Successful! Credits added.");
            if (onSuccess) onSuccess();
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#7f0df2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Error initiating payment");
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className={className || "bg-[#7f0df2] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#7f0df2]/90 transition-all"}
    >
      {children || "Upgrade"}
    </button>
  );
}
