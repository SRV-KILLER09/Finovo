
import { PaymentClient } from "@/components/payment-client";

export default function PayPage() {
  return (
    <div className="space-y-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Send & Receive Money</h1>
        <p className="text-muted-foreground">Easily pay anyone using their UPI ID or scan a QR code.</p>
      </header>
      <PaymentClient />
    </div>
  );
}
