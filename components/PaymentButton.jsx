"use client";

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function PaymentButton() {

  const handlePayment = async () => {

    const res = await fetch("/api/create-order", {
      method: "POST",
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: "Pathway AI Career Coach",

      description: "Premium Upgrade",

      image: "/pathway2.png",

      order_id: order.id,

      handler: function (response) {

        alert(
          "Payment Successful\n\nPayment ID:\n" +
          response.razorpay_payment_id
        );

      },

      theme: {
        color: "#EAB308",
      },
    };
    if (!window.Razorpay) {
  alert("Razorpay SDK failed to load.");
  return;
}
    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };

  return (
    <Button
      onClick={handlePayment}
      className="hidden md:inline-flex items-center gap-2
      bg-black border border-yellow-500
      hover:bg-zinc-900 text-white"
    >
      <CreditCard className="h-4 w-4 text-yellow-400" />
      Upgrade Pro
    </Button>
  );
}